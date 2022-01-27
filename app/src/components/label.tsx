import { Ref, ComponentProps, forwardRef } from "react";
import styled from "styled-components";

const Container = styled.label`
  font-size: 1.2rem;
  font-weight: 400;
  font-family: "Playfair Display";
`;

const Required = styled.span`
  font-weight: 400;
  opacity: 0.7;
  margin: 0 0 0 0.4rem;
`;

type LabelProps = ComponentProps<typeof Container> & {
  required?: boolean;
};

export const Label = forwardRef(function Label(
  { required, children, ...props }: LabelProps,
  ref: Ref<HTMLLabelElement>
) {
  return (
    <Container ref={ref} {...props}>
      {children}
      {required && <Required>(required)</Required>}
    </Container>
  );
});
