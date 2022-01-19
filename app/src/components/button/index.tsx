import { ComponentProps, ReactNode, forwardRef, Ref } from "react";
import styled from "styled-components";

import { CoreButton } from "./core";

const Container = styled(CoreButton)<{
  primary?: boolean;
  fullWidth?: boolean;
}>`
  height: 3.6rem;
  border: 0 none;
  background: ${(props) => (props.primary ? "#bbd7e7" : "#f00")};
  color: #000;
  padding: 0 1.8rem;
  margin: 0;
  border-radius: 0.3rem;
  align-self: flex-start;
  justify-self: flex-start;
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
`;

type ButtonProps = ComponentProps<typeof Container> & {
  icon?: ReactNode;
};

export const Button = forwardRef(function Button(
  { children, icon, ...props }: ButtonProps,
  ref: Ref<any>
) {
  return (
    <Container ref={ref} {...props}>
      {icon}
      <span>{children}</span>
    </Container>
  );
});
