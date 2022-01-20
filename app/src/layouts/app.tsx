import { PropsWithChildren, Suspense } from "react";
import styled from "styled-components";

import { TopBar } from "src/components/top-bar";
import { Sidebar } from "src/components/sidebar";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Content = styled.main`
  padding: 2.4rem;
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 90rem;
  margin: 0 auto;
`;

type AppLayoutProps = PropsWithChildren<Record<never, any>>;

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Container>
      <TopBar />
      <Content>
        <Suspense fallback={null}>
          <Sidebar />
          <Suspense fallback={null}>
            <Main>{children}</Main>
          </Suspense>
        </Suspense>
      </Content>
    </Container>
  );
}
