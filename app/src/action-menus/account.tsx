import "src/utils/firebase";

import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import styled from "styled-components";

import { useAuthUser } from "src/hooks/use-auth-user";
import { ActionMenu } from "src/components/action-menu";
import { P, Small } from "src/components/text";
import { ComponentProps } from "react";

const auth = getAuth();

const Email = styled(Small)`
  && {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0.6rem 0 0;
  }
`;

type AccountActionMenuProps = Omit<ComponentProps<typeof ActionMenu>, "items">;

export function AccountActionMenu(props: AccountActionMenuProps) {
  const authUser = useAuthUser();
  const router = useRouter();

  return (
    <ActionMenu
      placement="bottom-end"
      {...props}
      maxWidth="22rem"
      items={[
        {
          items: [
            {
              isCustom: true,
              Content: () => (
                <>
                  <P>You are currently logged in as {authUser?.user?.name}</P>
                  <Email grey>{authUser?.user?.id}</Email>
                </>
              ),
            },
          ],
        },
        {
          label: "Teams",
          items:
            authUser?.teams?.map?.((team: any) => {
              return {
                selectable: true,
                selected: team.id === router.query.teamId,
                label: team.name || "n/a",
                href: `/app/${team.id}`,
              };
            }) || [],
        },
        {
          items: [
            {
              label: "Create new team",
              href: `/app/${router.query.teamId}/account/teams/new`,
            },
            {
              label: "Profile settings",
              href: `/app/${router.query.teamId}/account/settings`,
            },
            {
              label: "Sign out",
              onClick: () => auth.signOut(),
            },
          ],
        },
      ]}
    />
  );
}
