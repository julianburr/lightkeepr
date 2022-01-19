import { Ref } from "react";
import { ComponentType, ComponentProps, ReactNode } from "react";
import styled from "styled-components";
import { Label } from "./label";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Description = styled.p``;

const Error = styled.p`
  color: #f4737d;
`;

export type BoxProps<TProps extends { title: string }> = {
  as: React.ComponentType<TProps>;
} & {
  props: Omit<TProps, "title">;
};

type PassedThroughProps = {
  id: string;
  name: string;
  label?: ReactNode;
  description?: ReactNode;
  required?: boolean;
  error?: any;
  ref?: Ref<any>;
};

type FieldProps<TProps> = {
  Input: React.ComponentType<PassedThroughProps & TProps>;
} & Omit<PassedThroughProps, "id"> & {
    id?: string;
    inputProps?: TProps;
  };

let uuid = 0;

export function Field<TProps>({
  id = `field--${++uuid}`,
  name,
  label,
  description,
  Input,
  inputProps,
  required,
  error,
}: FieldProps<TProps>) {
  return (
    <Container>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      {description && <Description>{description}</Description>}

      {/* eslint-disable-next-line */}
      {/* @ts-ignore */}
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
