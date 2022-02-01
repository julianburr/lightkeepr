import { MjmlSpacer } from "mjml-react";
import { ComponentProps } from "react";

export function Spacer(props: ComponentProps<typeof MjmlSpacer>) {
  return <MjmlSpacer {...props} />;
}
