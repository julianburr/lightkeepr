import styled from "styled-components";

const Input = styled.input`
  border: 0.1rem solid #ccc;
  border-radius: 0.2rem;
  padding: 0 1.2rem;
  height: 4rem;
`;

export function TextInput(props) {
  return <Input type="text" {...props} />;
}

export function EmailInput(props) {
  return <TextInput type="email" {...props} />;
}
