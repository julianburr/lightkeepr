import "src/utils/firebase";

import { PropsWithChildren, Suspense } from "react";
import styled from "styled-components";
import Link from "next/link";
import { getAuth } from "firebase/auth";

import { useAuthUser } from "src/hooks/use-auth-user";
import { TopBar } from "src/components/top-bar";
import { Button } from "src/components/button";
import { Tooltip } from "src/components/tooltip";
import { Spacer } from "src/components/spacer";
import { AccountActionMenu } from "src/action-menus/account";
import { DocsSidebar } from "src/sidebars/docs";

import LogoSvg from "src/assets/logo.svg";
import MenuSvg from "src/assets/icons/menu.svg";
import GridSvg from "src/assets/icons/grid.svg";
import SearchSvg from "src/assets/icons/search.svg";
import ExternalLinkSvg from "src/assets/icons/external-link.svg";
import LoginSvg from "src/assets/icons/log-in.svg";
import UserSvg from "src/assets/icons/user.svg";

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
          <Suspense fallback={null}>
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
          </Suspense>
        }
      />
      <Content>
        <Suspense fallback={null}>
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
        </Suspense>
        <Main>{children}</Main>
      </Content>
    </Container>
  );
}
