import { ComponentProps } from "react";
import { MjmlButton } from "mjml-react";

export function Button(props: ComponentProps<typeof MjmlButton>) {
  return (
    <MjmlButton backgroundColor="#5B93E7" innerPadding="16px 24px" {...props} />
  );
}
