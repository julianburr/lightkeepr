import { ComponentProps } from "react";
import { Ref } from "react";
import { forwardRef } from "react";
import styled from "styled-components";

export const Input = styled.input<{ error?: any }>`
  border: 0.1rem solid;
  border-color: ${(props) => (props.error ? `#f4737d` : `#eee`)};
  border-radius: 0.3rem;
  height: 3.6rem;
  padding: 0 1.2rem;
  width: 100%;
  transition: border 0.2s;

  &:hover,
  &:focus {
    border-color: ${(props) => (props.error ? `#f4737d` : `#ddd`)};
  }
`;

export const TextInput = forwardRef(function TextInput(
  props: ComponentProps<typeof Input>,
  ref: Ref<any>
) {
  return <Input type="text" ref={ref as any} {...props} />;
});

export const EmailInput = forwardRef(function EmailInput(
  props: ComponentProps<typeof Input>,
  ref: Ref<any>
) {
  return <Input type="email" ref={ref as any} {...props} />;
});
