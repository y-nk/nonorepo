declare module "*.md" {
  const html: string;
  export default html;
}

declare module "*.md?as=string" {
  const html: string;
  export default html;
}

declare module "*.md?as=dom" {
  const html: () => DocumentFragment;
  export default html;
}

declare module "*.md?as=react" {
  const html: (props: any) => React.ReactNode
  export default html;
}
