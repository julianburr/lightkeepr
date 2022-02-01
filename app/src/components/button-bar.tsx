import { ReactNode } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 0.4rem;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.4rem;
`;

const Left = styled(Inner)`
  @media (min-width: 800px) {
    margin: 0 1.2rem 0 0;
  }
`;

const Right = styled(Inner)`
  @media (min-width: 800px) {
    margin: 0 0 0 1.2rem;
  }
`;

type ButtonBarProps = {
  left?: ReactNode;
  right?: ReactNode;
};

export function ButtonBar({ left, right }: ButtonBarProps) {
  return (
    <Container>
      <Left>{left}</Left>
      <Right>{right}</Right>
    </Container>
  );
}
