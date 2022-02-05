import "src/utils/firebase";

import { doc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { useDocument } from "src/@packages/firebase";
import { Auth } from "src/components/auth";
import { Button } from "src/components/button";
import { List } from "src/components/list";
import { Spacer } from "src/components/spacer";
import { GroupHeading } from "src/components/text";
import { TitleBar } from "src/components/title-bar";
import { useAuthUser } from "src/hooks/use-auth-user";
import { AppLayout } from "src/layouts/app";
import { InviteListItem } from "src/list-items/invite";
import { UserListItem } from "src/list-items/user";

import PlusSvg from "src/assets/icons/outline/plus.svg";

const db = getFirestore();

function UsersList() {
  const router = useRouter();

  const teamRef = doc(db, "teams", router.query.teamId!);
  const team = useDocument(teamRef);

  // Split owners and other users
  const { owners, others } = useMemo(() => {
    return team.users?.reduce?.(
      (all: any, userId: string) => {
        const role = team.userRoles?.[userId];
        if (role === "owner") {
          all.owners.push({ userId, role });
        } else {
          all.others.push({ userId, role });
        }
        return all;
      },
      { owners: [], others: [] }
    );
  }, [team.users]);

  // Collect pending invites
  const pending = useMemo(() => {
    return (
      team.invites?.reduce?.((all: any, email: string) => {
        all.push({ email, ...team.inviteStatus?.[email] });
        return all;
      }, []) || []
    );
  }, [team.invites]);

  return (
    <>
      <GroupHeading>Owners</GroupHeading>
      <Spacer h=".2rem" />
      <List items={owners} Item={UserListItem} />
      <Spacer h="1.6rem" />

      {others.length > 0 && (
        <>
          <GroupHeading>Billing managers &amp; members</GroupHeading>
          <Spacer h=".2rem" />
          <List items={others} Item={UserListItem} />
          <Spacer h="1.6rem" />
        </>
      )}

      {pending.length > 0 && (
        <>
          <Spacer h=".6rem" />
          <GroupHeading>Pending invites</GroupHeading>
          <Spacer h=".2rem" />
          <List items={pending} Item={InviteListItem} />
        </>
      )}
    </>
  );
}

export default function Users() {
  const router = useRouter();
  const authUser = useAuthUser();

  return (
    <Auth>
      <AppLayout>
        <TitleBar
          title="Users"
          actions={
            <>
              {authUser.teamRole === "owner" && (
                <Button
                  icon={<PlusSvg />}
                  href={`/app/${router.query.teamId}/users/new`}
                >
                  Invite new user
                </Button>
              )}
            </>
          }
        />

        <Spacer h="2.4rem" />
        <UsersList />
      </AppLayout>
    </Auth>
  );
}
