interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly DEV: boolean;
  readonly SITE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
