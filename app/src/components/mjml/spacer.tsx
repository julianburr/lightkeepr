import { ComponentProps } from "react";
import { MjmlSpacer } from "mjml-react";

export function Spacer(props: ComponentProps<typeof MjmlSpacer>) {
  return <MjmlSpacer {...props} />;
}
