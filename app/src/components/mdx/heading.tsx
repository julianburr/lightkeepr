import slugify from "slugify";

import { Heading as H } from "src/components/text";

export function Heading({ level, children }: any) {
  const str = Array.isArray(children) ? children.join("") : children;
  const id = slugify(str.toLowerCase());
  return (
    <H level={level} id={id}>
      {children}
    </H>
  );
}
