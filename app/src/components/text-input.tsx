import { ComponentProps } from "react";
import { Ref } from "react";
import { forwardRef } from "react";
import styled from "styled-components";

export const Input = styled.input<{ error?: any }>`
  border: 0.1rem solid;
  border-color: ${(props) =>
    props.error
      ? `var(--sol--input-border-color-error)`
      : `var(--sol--input-border-color-default)`};
  border-radius: var(--sol--input-border-radius);
  height: 3.6rem;
  padding: 0 0.8rem;
  width: 100%;
  transition: border 0.2s;

  &:hover,
  &:focus {
    border-color: ${(props) =>
      props.error
        ? `var(--sol--input-border-color-hover-error)`
        : `var(--sol--input-border-color-hover-default)`};
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
