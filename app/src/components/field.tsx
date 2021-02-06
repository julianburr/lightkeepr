import { ComponentType } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1.2rem;
`;

const Label = styled.label`
  font-size: 1.2rem;
  color: #666;
`;

const Error = styled.p`
  margin: 0;
  padding: 0.4rem 0 0;
  font-size: 1.2rem;
  color: #c00;
`;

type FieldProps = {
  name: string;
  id?: string;
  label?: string;
  error?: string;
  Input: ComponentType<any>;
  inputProps?: any;
  disabled?: boolean;
  required?: boolean;
};

export function Field({
  name,
  id = name,
  label,
  error,
  Input,
  inputProps,
  ...props
}: FieldProps) {
  return (
    <Container>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input id={id} name={name} {...props} />
      {error && <Error>{error}</Error>}
    </Container>
  );
}
