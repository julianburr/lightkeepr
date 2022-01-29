import { ComponentProps, forwardRef } from "react";
import styled from "styled-components";

const Container = styled.div<{ columns?: number; gap?: string }>`
  display: grid;
  grid-template-columns: ${(props) =>
    Array.from(new Array(props.columns || 1))
      .fill("1fr")
      .join(" ")};
  gap: ${(props) => props.gap || "1.4rem"};
`;

export const FormGrid = forwardRef(function FormGrid(
  props: ComponentProps<typeof Container>,
  ref
) {
  return <Container ref={ref} noValidate {...props} />;
});
