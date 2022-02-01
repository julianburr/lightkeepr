import { HTMLAttributes } from "react";
import { DetailedHTMLProps } from "react";
import { ReactNode } from "react";
import styled from "styled-components";

const Container = styled.div<{ intent: Intent }>`
  display: flex;
  padding: 0.8rem;
  background: ${(props) => (props.intent === "error" ? "#f5737f" : "#000")};
  border-radius: 0.3rem;
  color: #fff;
  font-size: 1.2rem;
  position: relative;
  filter: drop-shadow(0 0 1rem rgba(0, 0, 0, 0.25));
  pointer-events: all;
`;

type Intent = "primary" | "error" | "default";

type ToastProps = Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "ref"
> & {
  message: ReactNode;
  icon?: ReactNode;
  intent?: Intent;
};

export function Toast({
  message,
  icon,
  intent = "default",
  ...props
}: ToastProps) {
  return (
    <Container intent={intent} tabIndex={0} {...props}>
      {icon}
      {message}
    </Container>
  );
}
