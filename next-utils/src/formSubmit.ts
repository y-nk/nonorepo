type ApiResponses = {
  success: unknown;
  failure: unknown;
};

type ApiSuccess<T extends ApiResponses> = {
  data: T['success'] | undefined
  errors: never
}

type ApiFailure<T extends ApiResponses> = {
  data: never
  errors: T['failure']
}

type ApiResponse<T extends ApiResponses> = ApiSuccess<T> | ApiFailure<T>

function success<T extends ApiResponses = ApiResponses>(data: any) {
  return { data } as ApiSuccess<T>
}

function failure<T extends ApiResponses = ApiResponses>(errors: any) {
  return { errors } as ApiFailure<T>
}

/**
 * A generic helper to handle form submission in a very lightweight way.
 * Pass the generic <T> to type the success value and <E> to type the errors
 *
 * Example:
 * ```tsx
 * type ApiEndpoint = {
 *   'success': {
 *     user: User
 *   }
 *   'failure': {
 *     message: string
 *   }[]
 * }
 *
 * async function onSubmit(ev: FormEvent<HTMLFormEvent>) {
 *   ev.preventDefault()
 *   const res = submit<ApiEndpoint>(ev.currentTarget)
 *
 *   if (res.data) {
 *     console.log(res.data)
 *   } else if (res.errors) {
 *     console.log(res.error)
 *   }
 * }
 * ```
 *
 * @param form the form to automate the submission
 * @param init Additional fetch options to pass
 * @returns the form submission result
 */
export async function submit<T extends ApiResponses = ApiResponses>(
  form: HTMLFormElement,
  init: Omit<RequestInit, 'method' | 'body'> = {},
): Promise<ApiResponse<T>> {
  const body = Object.fromEntries(new FormData(form));

  try {
    const res = await fetch(form.action, {
      method: form.method,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      ...init,
    });

    const json = await res.json();

    // soft errors are prioritized
    if ('errors' in json) {
      return failure<T>(json.errors)
    }

    return success<T>(json.data)
  } catch (error) {
    // hard errors
    return failure([error])
  }
}
