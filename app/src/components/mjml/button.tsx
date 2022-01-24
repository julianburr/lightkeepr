import { ComponentProps } from "react";
import { MjmlButton } from "mjml-react";

import { tokens } from "src/theme/tokens";

export function Button(props: ComponentProps<typeof MjmlButton>) {
  return (
    <MjmlButton
      backgroundColor={tokens.color.brand[500]}
      innerPadding="16px 24px"
      {...props}
    />
  );
}
