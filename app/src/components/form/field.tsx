import { ComponentType } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 1.2rem;
  font-weight: 600;
`;

type FieldProps<ComponentProps = { [key: string]: any }> = ComponentProps & {
  name: string;
  id?: string;
  label?: string;
  error?: string;
  Input: ComponentType<any>;
  disabled?: boolean;
  required?: boolean;
};

export function Field({
  name,
  id = name,
  label: labelString,
  error,
  Input,
  ...props
}: FieldProps) {
  return (
    <Container>
      {labelString && <Label htmlFor={id}>{labelString}</Label>}
      <Input id={id} name={name} {...props} />
    </Container>
  );
}
