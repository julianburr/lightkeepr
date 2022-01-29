import { Ref, ComponentType, ReactNode } from "react";
import { useControlled, useFormMethods } from "react-cool-form";
import styled from "styled-components";
import { Label } from "./label";

const Container = styled.div`
  display: flex;
  flex-direction: column;

  p {
    margin: 0;
  }
`;

const Description = styled.p`
  && {
    font-size: 1.2rem;
    line-height: 1.2;
    color: rgba(0, 0, 0, 0.4);
    margin: 0.2rem 0.1rem;
  }
`;

const WrapLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0.1rem 0.1rem;
`;

const Error = styled.p`
  && {
    color: #f4737d;
    font-size: 1.2rem;
    margin: 0.1rem;
  }
`;

function Controlled({ Input, name, ...props }: any) {
  const [fieldProps] = useControlled(name);
  return <Input {...props} {...fieldProps} />;
}

type FieldProps = {
  id?: string;
  name: string;
  label?: ReactNode;
  description?: ReactNode;
  required?: boolean;
  ref?: Ref<any>;
  Input: ComponentType<any>;
  inputProps?: any;
  showError?: boolean;
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
  showError = true,
}: FieldProps) {
  const [fieldProps, { error }] = useControlled(name);

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
        label={label}
        description={description}
        required={required}
        error={error}
        {...fieldProps}
        {...inputProps}
      />

      {error && showError && <Error>{error}</Error>}
    </Container>
  );
}
