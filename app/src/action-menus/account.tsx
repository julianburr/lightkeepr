import "src/utils/firebase";

import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";
import styled from "styled-components";

import { useCollection } from "src/@packages/firebase";
import { useAuthUser } from "src/hooks/use-auth-user";
import { ActionMenu } from "src/components/action-menu";
import { Avatar } from "src/components/avatar";
import { P, Small } from "src/components/text";
import { useFirestore } from "src/@packages/firebase/firestore/context";

const auth = getAuth();
const db = getFirestore();

const Email = styled(Small)`
  && {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0.6rem 0 0;
  }
`;

export function AccountActionMenu() {
  const authUser = useAuthUser();
  const router = useRouter();

  const { clearCache } = useFirestore();

  const organisations = useCollection(collection(db, "organisations"), {
    key: "organisations",
  });

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
          items: authUser.organisationUsers.map((u: any) => {
            const orgName =
              organisations?.find?.((o: any) => o.id === u.organisation.id)
                ?.name || "n/a";
            return {
              selectable: true,
              selected: u.id === router.query.orgUserId,
              label: orgName,
              href: `/app/${u.id}`,
            };
          }),
        },
        {
          items: [
            {
              label: "Account settings",
              href: `/app/${router.query.orgUserId}/account/settings`,
            },
            {
              label: "Sign out",
              onClick: async () => {
                await auth.signOut();
                clearCache?.();
              },
            },
          ],
        },
      ]}
    >
      {(props) => <Avatar name={authUser.user.name} {...props} />}
    </ActionMenu>
  );
}
