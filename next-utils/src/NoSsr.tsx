// https://stackoverflow.com/a/57173209/335243
import dynamic from "next/dynamic"
import type { PropsWithChildren } from "react"

const NoSsr = ({ children }: PropsWithChildren) => <>{children}</>

export default dynamic(async () => NoSsr, { ssr: false })
