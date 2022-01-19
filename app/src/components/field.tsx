import { Ref, ComponentType, ReactNode } from "react";
import styled from "styled-components";
import { Label } from "./label";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Description = styled.p``;

const WrapLabel = styled.div`
  height: 1.8rem;
  flex-direction: row;
  align-items: center;
  padding: 0 0.3rem;
`;

type FieldProps = {
  id?: string;
  name: string;
  label?: ReactNode;
  description?: ReactNode;
  required?: boolean;
  error?: any;
  ref?: Ref<any>;
  Input: ComponentType<any>;
  inputProps?: any;
};

let uuid = 0;

export function Field({
  id = `field--${++uuid}`,
  name,
  label,
  description,
  Input,
  inputProps,
  required,
  error,
}: FieldProps) {
  return (
    <Container>
      {label && (
        <WrapLabel>
          <Label htmlFor={id} required={required}>
            {label}
          </Label>
        </WrapLabel>
      )}
      {description && <Description>{description}</Description>}

      <Input
        id={id}
        name={name}
        label={label}
        description={description}
        required={required}
        error={error}
        {...inputProps}
      />
    </Container>
  );
}
