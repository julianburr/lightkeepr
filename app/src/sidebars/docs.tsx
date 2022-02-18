import { ComponentProps } from "react";
import styled from "styled-components";

import { FirebaseProvider } from "src/@packages/firebase";
import { SuspenseProvider } from "src/@packages/suspense";
import { Avatar } from "src/components/avatar";
import { Menu } from "src/components/menu";
import { Sidebar } from "src/components/sidebar";
import { Spacer } from "src/components/spacer";
import { Suspense } from "src/components/suspense";
import { P, Small } from "src/components/text";
import { useAuthUser } from "src/hooks/use-auth-user";

const WrapProfile = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.8rem;
`;

const WrapName = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  p {
    margin: 0;
    line-height: 1.2;
  }
`;

type DocsSidebarProps = {
  menuItems: ComponentProps<typeof Menu>["items"];
};

function Top() {
  const authUser = useAuthUser();

  if (!authUser.user) {
    return (
      <WrapProfile>
        <Avatar name="Anonymous" />
        <WrapName>
          <P>Anonymous</P>
          <Spacer h=".3rem" />
          <Small grey>You are currently not logged in</Small>
        </WrapName>
      </WrapProfile>
    );
  }

  return (
    <WrapProfile>
      <Avatar background="#3dc5ce" color="#fff" name={authUser?.user?.name} />
      <WrapName>
        <P>{authUser?.user?.name}</P>
        <Spacer h=".3rem" />
        <Small grey>{authUser?.user?.email}</Small>
      </WrapName>
    </WrapProfile>
  );
}

export function DocsSidebar({ menuItems }: DocsSidebarProps) {
  return (
    <Sidebar
      top={
        <SuspenseProvider>
          <FirebaseProvider>
            <Suspense
              fallback={
                <WrapProfile>
                  <Avatar />
                  <WrapName>
                    <Small grey>Loading...</Small>
                  </WrapName>
                </WrapProfile>
              }
            >
              <Top />
            </Suspense>
          </FirebaseProvider>
        </SuspenseProvider>
      }
    >
      <Menu items={menuItems} />
    </Sidebar>
  );
}
