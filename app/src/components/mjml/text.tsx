import { MjmlText } from "mjml-react";
import { ComponentProps } from "react";

export function P(props: ComponentProps<typeof MjmlText>) {
  return (
    <MjmlText fontSize={15} fontWeight={300} lineHeight="1.4" {...props} />
  );
}

export function Heading(props: ComponentProps<typeof MjmlText>) {
  return <MjmlText fontSize={24} lineHeight="1.2" align="center" {...props} />;
}
