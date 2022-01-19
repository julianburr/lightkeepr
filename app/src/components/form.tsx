import { Ref, ComponentProps, forwardRef } from "react";
import styled from "styled-components";

const Container = styled.form<{ columns?: number; gap?: string }>`
  display: grid;
  grid-template-columns: ${(props) =>
    Array.from(new Array(props.columns || 1))
      .fill("1fr")
      .join(" ")};
  gap: ${(props) => props.gap || "1.2rem"};
`;

type FormProps = ComponentProps<typeof Container>;

export const Form = forwardRef(function Form(props: FormProps, ref: Ref<any>) {
  return <Container ref={ref} {...props} />;
});
