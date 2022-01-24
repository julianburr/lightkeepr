import { ReactNode } from "react";
import styled from "styled-components";

import { Label } from "./label";
import { P } from "./text";

const Container = styled.div`
  display: flex;
  flex-direction: column;

  p {
    margin: 0;
  }
`;

type ValueProps = {
  label: ReactNode;
  value?: ReactNode;
};

export function Value({ label, value }: ValueProps) {
  return (
    <Container>
      <Label>{label}</Label>
      <P>{value || "—"}</P>
    </Container>
  );
}
