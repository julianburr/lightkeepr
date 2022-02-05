import "src/utils/firebase";

import { getAuth } from "firebase/auth";
import Link from "next/link";
import { PropsWithChildren } from "react";
import styled from "styled-components";

import { FirebaseProvider } from "src/@packages/firebase";
import { SuspenseProvider } from "src/@packages/suspense";
import { AccountActionMenu } from "src/action-menus/account";
import { Button } from "src/components/button";
import { Spacer } from "src/components/spacer";
import { Suspense } from "src/components/suspense";
import { Tooltip } from "src/components/tooltip";
import { TopBar } from "src/components/top-bar";
import { useAuthUser } from "src/hooks/use-auth-user";
import { DialogProvider } from "src/hooks/use-dialog";
import { ToastProvider } from "src/hooks/use-toast";
import { DocsSidebar } from "src/sidebars/docs";

import ExternalLinkSvg from "src/assets/icons/outline/external-link.svg";
import LoginSvg from "src/assets/icons/outline/login.svg";
import MenuSvg from "src/assets/icons/outline/menu.svg";
import SearchSvg from "src/assets/icons/outline/search.svg";
import UserSvg from "src/assets/icons/outline/user.svg";
import GridSvg from "src/assets/icons/outline/view-grid.svg";
import LogoSvg from "src/assets/logo.svg";

const auth = getAuth();

const Logo = styled.div`
  height: 6.8rem;
  display: flex;
  position: relative;

  a {
    height: 6.8rem;
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: center;
    position: relative;
    font-family: "Playfair Display";
    font-size: 2.2rem;
    color: inherit;
    font-weight: 800;

    &,
    &:hover,
    &:focus {
      color: inherit;
      text-decoration: none;
    }

    svg {
      height: 5.4rem;
      width: auto;

      .lh-color {
        fill: var(--sol--color-brand-500) !important;
      }
    }

    span span {
      font-weight: 400;
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  width: 100%;
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex: 1;
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

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: opacity 0.2s;
  gap: 0.6rem;
`;

type DocsLayoutProps = PropsWithChildren<Record<never, any>>;

function TopBarActions() {
  const authUser = useAuthUser();
  return (
    <Buttons data-tablet>
      <Tooltip content="Search (cmd+k)">
        {(props) => <Button {...props} icon={<SearchSvg />} />}
      </Tooltip>

      <Tooltip content="App switcher">
        {(props) => <Button {...props} icon={<GridSvg />} />}
      </Tooltip>

      <Spacer w="1.2rem" />
      <AccountActionMenu
        items={[
          {
            items: authUser?.user
              ? [
                  { label: "Go to app", href: "/app" },
                  { label: "Logout", onClick: () => auth.signOut() },
                ]
              : [{ label: "Go to app", href: "/app" }],
          },
        ]}
      >
        {(props) => (
          <Button
            {...props}
            intent={authUser?.user ? "primary" : "secondary"}
            icon={
              authUser?.user ? (
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
              ) : (
                <UserSvg />
              )
            }
          />
        )}
      </AccountActionMenu>
    </Buttons>
  );
}

export function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <Container>
      <TopBar
        logo={
          <Logo>
            <Link href="/docs">
              <a>
                <LogoSvg />
                <span>
                  lightkeepr <span>docs</span>
                </span>
              </a>
            </Link>
          </Logo>
        }
        actions={
          <Suspense
            fallback={
              <Buttons>
                <Tooltip content="Search (cmd+k)">
                  {(props) => <Button {...props} icon={<SearchSvg />} />}
                </Tooltip>

                <Tooltip content="App switcher">
                  {(props) => <Button {...props} icon={<GridSvg />} />}
                </Tooltip>

                <Spacer w="1.2rem" />
                <Button disabled intent={"secondary"} icon={<UserSvg />} />
              </Buttons>
            }
          >
            <SuspenseProvider>
              <FirebaseProvider>
                <DialogProvider>
                  <ToastProvider>
                    <TopBarActions />

                    <Button
                      data-mobile
                      icon={<MenuSvg />}
                      size="large"
                      intent="ghost"
                      onClick={() => {
                        const event = new CustomEvent("toggleMobileMenu");
                        window.document.body.dispatchEvent(event);
                      }}
                    />
                  </ToastProvider>
                </DialogProvider>
              </FirebaseProvider>
            </SuspenseProvider>
          </Suspense>
        }
      />
      <Content>
        <DocsSidebar
          menuItems={[
            {
              mobile: true,
              label: "Search",
              icon: <SearchSvg />,
              onClick: () => alert("Search"),
            },
            {
              mobile: true,
              label: "Go to app",
              href: "/app",
              icon: <LoginSvg />,
            },
            {
              mobile: true,
              label: "App switcher",
              icon: <GridSvg />,
              onClick: () => alert("Hi!"),
            },

            {
              mobile: true,
              label: "",
              items: [],
            },

            {
              label: "Getting started",
              href: "/docs/getting-started",
            },

            {
              label: "Features",
              items: [
                {
                  label: "Teams",
                  href: "/docs/features/teams",
                },
                {
                  label: "Projects",
                  href: "/docs/features/projects",
                },
                {
                  label: "Runs",
                  href: "/docs/features/runs",
                },
                {
                  label: "Reports",
                  href: "/docs/features/reports",
                },
                {
                  label: "Compare reports",
                  href: "/docs/features/compare-reports",
                },
              ],
            },
            {
              label: "CLI",
              items: [
                {
                  label: "Getting started",
                  href: "/docs/cli/getting-started",
                },
                {
                  label: "Options",
                  href: "/docs/cli/options",
                },
              ],
            },
            {
              label: "Node",
              items: [
                {
                  label: "Getting started",
                  href: "/docs/node/getting-started",
                },
                {
                  label: "Options",
                  href: "/docs/node/options",
                },
              ],
            },
            {
              label: "Cypress",
              items: [
                {
                  label: "Getting started",
                  href: "/docs/cypress/getting-started",
                },
                {
                  label: "Options",
                  href: "/docs/cypress/options",
                },
              ],
            },
            {
              label: "Contribute",
              items: [
                {
                  label: "Contribution guide",
                  href: "/docs/contribute/guide",
                },
                {
                  label: "Contribute to the docs",
                  href: "/docs/contribute/contribute-to-docs",
                },
                {
                  label: "Report an issue",
                  href: "/docs/contribute/report-an-issue",
                },
                {
                  label: "Github repo",
                  href: "https://github.com/julianburr/lightkeepr",
                  icon: <ExternalLinkSvg />,
                },
              ],
            },
          ]}
        />
        <Main>{children}</Main>
      </Content>
    </Container>
  );
}
