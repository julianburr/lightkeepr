import { PropsWithChildren, Suspense } from "react";
import styled from "styled-components";

import { TopBar } from "src/components/top-bar";
import { Sidebar } from "src/components/sidebar";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const Content = styled.main`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 90rem;
  margin: 0 auto;
  padding: 3.2rem 2.4rem 2.4rem;
`;

type AppLayoutProps = PropsWithChildren<Record<never, any>>;

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Container>
      <TopBar />
      <Content>
        <Sidebar />
        <Suspense fallback={null}>
          <Main>{children}</Main>
        </Suspense>
      </Content>
    </Container>
  );
}
