import styled from "styled-components";
import { P } from "./text";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 3.6rem;
  background: #f5f4f1;
  border-radius: 0.3rem;
  padding: 0 0.8rem;
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
      <P>{value || "—"}</P>
    </Container>
  );
}
