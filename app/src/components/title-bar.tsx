import { ReactNode } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 0 0.6rem;

  & > * {
    margin: 0 0 0 0.6rem;
  }
`;

type TitleBarProps = {
  title: ReactNode;
  actions?: ReactNode;
};

export function TitleBar({ title, actions }: TitleBarProps) {
  return (
    <Container>
      <h1>{title}</h1>
      <Actions>{actions}</Actions>
    </Container>
  );
}
