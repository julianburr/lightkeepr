import styled from "styled-components";
import { Value } from "./value";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 3.6rem;
  border-top: 0.1rem solid #eee;
`;

type ReadonlyInputProps = {
  id?: string;
  name?: string;
  value?: string | number;
};

export function ReadonlyInput({ id, name, value }: ReadonlyInputProps) {
  return (
    <Container>
      <input id={id} type="hidden" name={name} value={value} />
      <Value>{value || "—"}</Value>
    </Container>
  );
}
