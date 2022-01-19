import { ComponentProps, ReactNode, forwardRef, Ref } from "react";
import styled from "styled-components";

import { CoreButton } from "./core";

const Container = styled(CoreButton)<{
  intend?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
}>`
  align-self: flex-start;
  justify-self: flex-start;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: ${(props) =>
    props.size === "small"
      ? "2.8rem"
      : props.size === "large"
      ? "4.4rem"
      : "3.6rem"};
  background: ${(props) =>
    props.intend === "primary" ? "#bbd7e7" : "transparent"};
  border: ${(props) =>
    props.intend === "primary" ? "0 none" : ".1rem solid #eee"};
  border-radius: 0.3rem;
  color: #000;
  padding: ${(props) =>
    props.size === "small"
      ? "0 1.2rem"
      : props.size === "large"
      ? "0 2.4rem"
      : "0 1.8rem"};
  margin: 0;
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
  transition: border 0.2s, filter 0.2s, opacity 0.2s;

  svg {
    height: 1.4em;
    width: auto;
    margin: 0 0.8rem 0 0;
    filter: grayscale(1);
    transition: filter 0.2s;
  }

  &:hover,
  &:focus {
    border: ${(props) =>
      props.intend === "primary" ? "0 none" : ".1rem solid #ddd"};

    svg {
      filter: grayscale(0);
    }
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
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
