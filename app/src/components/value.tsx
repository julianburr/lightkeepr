import classNames from "classnames";
import { ReactNode } from "react";
import styled from "styled-components";

import { Label } from "./label";
import { P } from "./text";

const Container = styled.div<{ horizontal?: boolean }>`
  display: flex;
  flex-direction: column;

  @media (min-width: 800px) {
    &.horizontal {
      flex-direction: row;

      label {
        margin: 0.1rem 0 0;
        width: 9rem;
      }
    }
  }

  p {
    margin: 0;
  }
`;

type ValueProps = {
  label: ReactNode;
  value?: ReactNode;
  horizontal?: boolean;
};

export function Value({ label, value, horizontal }: ValueProps) {
  return (
    <Container className={classNames({ horizontal })}>
      <Label>{label}</Label>
      <P>{value || "—"}</P>
    </Container>
  );
}
