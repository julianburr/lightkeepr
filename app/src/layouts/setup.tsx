import { PropsWithChildren } from "react";
import { TopBar } from "src/components/top-bar";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Content = styled.main`
  padding: 4.8rem 2.4rem;
  width: 100%;
  max-width: 46rem;
  display: flex;
  flex-direction: column;
`;

type SetupLayoutProps = PropsWithChildren<Record<never, any>>;

export function SetupLayout({ children }: SetupLayoutProps) {
  return (
    <Container>
      <TopBar setup />
      <Content>{children}</Content>
    </Container>
  );
}
