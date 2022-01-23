import { ReactNode } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Left = styled(Inner)`
  margin: 0 1.2rem 0 0;

  & > * {
    margin: 0 0.6rem 0 0;
  }
`;

const Right = styled(Inner)`
  margin: 0 0 0 1.2rem;

  & > * {
    margin: 0 0 0 0.6rem;
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
