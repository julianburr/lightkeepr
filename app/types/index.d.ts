declare module "*.svg" {
  import { ComponentType, HTMLProps } from "react";
  export const ReactComponent: ComponentType<HTMLProps<SVGElement>>;
}

declare module "remark-copy-linked-files" {
  export default any;
}

declare module "rehype-external-links" {
  export default any;
}
