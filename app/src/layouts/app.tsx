import { PropsWithChildren, Suspense } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";

import { useAuthUser } from "src/hooks/use-auth-user";
import { TopBar } from "src/components/top-bar";
import { Sidebar } from "src/components/sidebar";
import { Loader } from "src/components/loader";
import { Tooltip } from "src/components/tooltip";
import { Button } from "src/components/button";
import { AccountActionMenu } from "src/action-menus/account";

import LogoSvg from "src/assets/logo.svg";
import BellSvg from "src/assets/icons/bell.svg";
import SearchSvg from "src/assets/icons/search.svg";
import LifeBuoySvg from "src/assets/icons/life-buoy.svg";
import GridSvg from "src/assets/icons/grid.svg";
import MenuSvg from "src/assets/icons/menu.svg";
import { Spacer } from "src/components/spacer";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
  width: 100%;
`;

const Content = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: row;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  max-width: 90rem;
  margin: 0 auto;
  padding: 2.4rem;
`;

const Logo = styled.div`
  height: 6.8rem;
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: flex-end;
  margin: 0 0 0 -0.6rem;
  position: relative;
  z-index: 2;

  svg {
    height: 5.4rem;
    width: auto;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: opacity 0.2s;
  gap: 0.6rem;
`;

type AppLayoutProps = PropsWithChildren<Record<never, any>>;

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const authUser = useAuthUser();

  return (
    <Container>
      <TopBar
        logo={
          <Logo>
            <Link href={`/app/${router.query.teamId}`}>
              <a>
                <LogoSvg />
              </a>
            </Link>
          </Logo>
        }
        actions={
          <>
            <Buttons data-tablet>
              <Tooltip content="Search (cmd+k)">
                {(props) => <Button {...props} icon={<SearchSvg />} />}
              </Tooltip>
              <Tooltip content="Notifications">
                {(props) => <Button {...props} icon={<BellSvg />} />}
              </Tooltip>
              <Tooltip content="Support">
                {(props) => <Button {...props} icon={<LifeBuoySvg />} />}
              </Tooltip>

              <Spacer w="1.2rem" />

              <Tooltip content="App switcher">
                {(props) => <Button {...props} icon={<GridSvg />} />}
              </Tooltip>

              <Spacer w="1.2rem" />

              <AccountActionMenu>
                {(props) => (
                  <Button
                    {...props}
                    intent="primary"
                    icon={
                      <>
                        {authUser?.user?.name
                          ?.split?.(" ")
                          .filter(Boolean)
                          .reduce((all, w, index, names) => {
                            if (index === 0 || index === names.length - 1) {
                              all += w[0];
                            }
                            return all;
                          }, "")}
                      </>
                    }
                  />
                )}
              </AccountActionMenu>
            </Buttons>

            <Buttons data-mobile>
              <Button
                icon={<SearchSvg />}
                size="large"
                intent="ghost"
                onClick={() => {
                  alert("search");
                }}
              />
              <Button
                icon={<MenuSvg />}
                size="large"
                intent="ghost"
                onClick={() => {
                  const event = new CustomEvent("toggleMobileMenu");
                  window.document.body.dispatchEvent(event);
                }}
              />
            </Buttons>
          </>
        }
      />
      <Content>
        <Sidebar />
        <Suspense fallback={<Loader message="Load content..." />}>
          <Main>{children}</Main>
        </Suspense>
      </Content>
    </Container>
  );
}
