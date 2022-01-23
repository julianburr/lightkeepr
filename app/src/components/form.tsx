import { Ref, ComponentProps, forwardRef, createContext, useMemo } from "react";
import { useFormMethods } from "react-cool-form";
import styled from "styled-components";

type FormContextValue = {
  formMethods?: any;
};

export const FormContext = createContext<FormContextValue>({});

const Container = styled.form<{ columns?: number; gap?: string }>`
  display: grid;
  grid-template-columns: ${(props) =>
    Array.from(new Array(props.columns || 1))
      .fill("1fr")
      .join(" ")};
  gap: ${(props) => props.gap || "1.4rem"};
`;

type FormProps = ComponentProps<typeof Container>;

export const Form = forwardRef(function Form(props: FormProps, ref: Ref<any>) {
  const formMethods = useFormMethods();
  const value = useMemo(() => ({ formMethods }), [formMethods]);
  return (
    <FormContext.Provider value={value}>
      <Container ref={ref} noValidate {...props} />
    </FormContext.Provider>
  );
});
