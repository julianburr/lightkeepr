import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { TopBar } from "src/components/top-bar";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Content = styled.main`
  padding: 2.4rem;
  width: 100%;
  max-width: 110rem;
  display: flex;
  flex-direction: row;
  background: yellow;
`;

const Sidebar = styled.menu`
  width: 28rem;
  flex-shrink: 0;
  margin: 0 2.4rem 0 0;
  background: red;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

type AppLayoutProps = PropsWithChildren<Record<never, any>>;

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();

  const { orgUserId } = router.query;

  return (
    <Container>
      <TopBar />
      <Content>
        <Sidebar>
          <ul>
            <li>
              <Link href={`/app/${orgUserId}/settings`}>
                Organisation Settings
              </Link>
            </li>
          </ul>
        </Sidebar>
        <Main>{children}</Main>
      </Content>
    </Container>
  );
}
