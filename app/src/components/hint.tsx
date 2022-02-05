import { PropsWithChildren } from "react";
import styled from "styled-components";

import BulbSvg from "src/assets/icons/outline/light-bulb.svg";

const Container = styled.div`
  width: 100%;
  padding: 1.2rem 1.2rem 1.2rem 4.8rem;
  background: var(--sol--palette-sand-50);
  position: relative;
`;

const WrapIcon = styled.div`
  position: absolute;
  top: -0.4rem;
  left: -0.4rem;
  height: 3.6rem;
  width: 3.6rem;
  background: var(--sol--container-primary-background);
  color: var(--sol--container-primary-foreground);
  border-radius: var(--sol--border-radius-s);
  box-shadow: 0 0.2rem 1.2rem rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    height: 1.8rem;
    width: auto;
  }
`;

export function Hint({ children }: PropsWithChildren<Record<never, any>>) {
  return (
    <Container>
      <WrapIcon>
        <BulbSvg />
      </WrapIcon>
      <div>{children}</div>
    </Container>
  );
}
