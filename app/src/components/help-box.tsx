import styled from "styled-components";

import BulbSvg from "src/assets/icons/bulb.svg";
import { PropsWithChildren } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--sol--container-light-background);
  padding: var(--sol--spacing-l);
  border-radius: var(--sol--border-radius-s);
  position: relative;
  overflow: hidden;
  margin: 0 -0.8rem;

  @media (min-width: 800px) {
    padding: var(--sol--spacing-xl);

    h1,
    h2,
    p {
      width: 80%;
    }
  }
`;

const BackgroundIcon = styled.div`
  position: absolute;
  top: -2rem;
  right: -2rem;
  z-index: 1;

  svg {
    opacity: 0.02;
    height: 15rem;
    width: auto;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
`;

export function HelpBox({ children }: PropsWithChildren<Record<never, any>>) {
  return (
    <Container>
      <BackgroundIcon>
        <BulbSvg />
      </BackgroundIcon>
      <Content>{children}</Content>
    </Container>
  );
}
