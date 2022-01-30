import { Suspense, ComponentProps } from "react";
import styled from "styled-components";

import { useAuthUser } from "src/hooks/use-auth-user";
import { Avatar } from "src/components/avatar";
import { Loader } from "src/components/loader";
import { P, Small } from "src/components/text";
import { Spacer } from "src/components/spacer";
import { Sidebar } from "src/components/sidebar";
import { Menu } from "src/components/menu";

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
  return (
    <WrapProfile>
      <Avatar background="#3dc5ce" color="#fff" name={authUser?.user?.name} />
      <WrapName>
        <P>{authUser?.user?.name}</P>
        <Spacer h=".3rem" />
        <Small grey>{authUser?.user?.id}</Small>
      </WrapName>
    </WrapProfile>
  );
}

export function DocsSidebar({ menuItems }: DocsSidebarProps) {
  return (
    <Sidebar
      top={
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
      }
    >
      <Suspense fallback={<Loader />}>
        <Menu items={menuItems} />
      </Suspense>
    </Sidebar>
  );
}
