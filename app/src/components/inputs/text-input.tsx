import styled from "styled-components";

const Input = styled.input`
  padding: 0.6rem;
  border: 0.1rem solid #aaa;
  border-radius: 0.2rem;
`;

export function TextInput(props) {
  return <Input type="text" {...props} />;
}
