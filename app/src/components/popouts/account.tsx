import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";

import { useAuthUser } from "src/hooks/use-auth-user";
import styled from "styled-components";

import { ActionMenu } from "../action-menu";
import { Avatar } from "../avatar";
import { Spacer } from "../spacer";
import { P, Small } from "../text";

const auth = getAuth();

const Email = styled(Small)`
  && {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0.4rem 0 0;
  }
`;

export function AccountActionMenu() {
  const authUser = useAuthUser();
  const router = useRouter();

  return (
    <ActionMenu
      placement="bottom-end"
      items={[
        {
          items: [
            {
              isCustom: true,
              Content: () => (
                <>
                  <P>You are currently logged in as {authUser.user.name}</P>
                  <Email grey>{authUser.user.id}</Email>
                </>
              ),
            },
          ],
        },
        {
          label: "Accounts",
          items: authUser.organisationUsers.map((u: any) => ({
            selectable: true,
            selected: u.id === router.query.orgUserId,
            label: u.id,
            href: `/app/${u.id}`,
          })),
        },
        {
          items: [
            {
              label: "Account settings",
              href: `/app/${router.query.orgUserId}/account/settings`,
            },
            {
              label: "Sign out",
              onClick: () => auth.signOut(),
            },
          ],
        },
      ]}
    >
      {(props) => <Avatar name={authUser.user.name} {...props} />}
    </ActionMenu>
  );
}
