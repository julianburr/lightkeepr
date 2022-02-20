import "src/utils/firebase";

import { getAuth } from "firebase/auth";
import Link from "next/link";
import { PropsWithChildren, useCallback, useState } from "react";
import styled from "styled-components";

import { FirebaseProvider } from "src/@packages/firebase";
import { SuspenseProvider } from "src/@packages/suspense";
import { AccountActionMenu } from "src/action-menus/account";
import { Button } from "src/components/button";
import { GlobalSearch, toggleGlobalSearch } from "src/components/global-search";
import { Spacer } from "src/components/spacer";
import { Suspense } from "src/components/suspense";
import { Tooltip } from "src/components/tooltip";
import { TopBar } from "src/components/top-bar";
import { AppSwitcherDialog } from "src/dialogs/app-switcher";
import { useAuthUser } from "src/hooks/use-auth-user";
import { DialogProvider, useDialog } from "src/hooks/use-dialog";
import { ToastProvider } from "src/hooks/use-toast";
import { AppSwitcherPopout } from "src/popouts/app-switcher";
import { DocsSidebar } from "src/sidebars/docs";
import { api } from "src/utils/api-client";

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

const Soon = styled.span`
  font-size: 1rem;
  padding: 0.2rem 0.4rem;
  background: var(--sol--palette-sand-100);
  font-family: "Playfair Display";
  vertical-align: middle;
  margin: -0.2rem 0 0 0.4rem;
  display: inline-flex;
  border-radius: 0.3rem;

  &:before {
    content: "soon";
  }
`;

type DocsLayoutProps = PropsWithChildren<Record<never, any>>;

function TopBarActions() {
  const authUser = useAuthUser();
  return (
    <Buttons data-tablet>
      <Tooltip content="Search (cmd+k)">
        {(props) => (
          <Button
            {...props}
            icon={<SearchSvg />}
            onClick={() => toggleGlobalSearch()}
          />
        )}
      </Tooltip>

      <AppSwitcherPopout>
        {(props) => <Button {...props} icon={<GridSvg />} />}
      </AppSwitcherPopout>

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
  const appSwitcherDialog = useDialog(AppSwitcherDialog);

  // Handle search and search results
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const handleSearch = useCallback((searchValue) => {
    api
      .post(`/api/search/docs`, { searchTerm: searchValue.trim() })
      .then(({ data }: any) => setSearchResults(data))
      .catch((e) => console.error(e));
  }, []);

  return (
    <>
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
                <>
                  <Buttons data-tablet>
                    <Tooltip content="Search (cmd+k)">
                      {(props) => (
                        <Button
                          {...props}
                          icon={<SearchSvg />}
                          onClick={() => toggleGlobalSearch()}
                        />
                      )}
                    </Tooltip>

                    <AppSwitcherPopout>
                      {(props) => <Button {...props} icon={<GridSvg />} />}
                    </AppSwitcherPopout>

                    <Spacer w="1.2rem" />
                    <Button disabled intent={"secondary"} icon={<UserSvg />} />
                  </Buttons>
                  <Button
                    data-mobile
                    icon={<MenuSvg />}
                    size="large"
                    intent="ghost"
                    disabled
                  />
                </>
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
                onClick: () => {
                  toggleGlobalSearch();
                  const event = new CustomEvent("toggleMobileMenu");
                  window.document.body.dispatchEvent(event);
                },
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
                onClick: () => appSwitcherDialog.open(),
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
                label: "FAQs",
                href: "/docs/faqs",
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
                  {
                    label: (
                      <>
                        Comments
                        <Soon />
                      </>
                    ),
                    href: "/docs/features/comments",
                  },
                ],
              },

              {
                label: "Integrations",
                items: [
                  {
                    label: (
                      <>
                        Webhooks
                        <Soon />
                      </>
                    ),
                    href: "/docs/integrations/webhooks",
                  },
                  {
                    label: (
                      <>
                        Slack
                        <Soon />
                      </>
                    ),
                    href: "/docs/integrations/slack",
                  },
                  {
                    label: (
                      <>
                        Jira
                        <Soon />
                      </>
                    ),
                    href: "/docs/integrations/jira",
                  },
                  {
                    label: (
                      <>
                        Zapier
                        <Soon />
                      </>
                    ),
                    href: "/docs/integrations/zapier",
                  },
                ],
              },

              {
                label: "Packages",
                items: [
                  {
                    label: "@lightkeepr/cli",
                    href: "/docs/packages/cli",
                  },
                  {
                    label: "@lightkeepr/node",
                    href: "/docs/packages/node",
                  },
                  {
                    label: (
                      <>
                        @lightkeepr/cypress
                        <Soon />
                      </>
                    ),
                    href: "/docs/packages/cypress",
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
                    label: "Report an issue",
                    href: "/docs/contribute/report-an-issue",
                  },
                  {
                    label: "Github repo",
                    href: "https://github.com/julianburr/lightkeepr",
                    icon: <ExternalLinkSvg />,
                    target: "_blank",
                  },
                ],
              },
            ]}
          />
          <Main>{children}</Main>
        </Content>
      </Container>

      <GlobalSearch onSearch={handleSearch} results={searchResults} />
    </>
  );
}
