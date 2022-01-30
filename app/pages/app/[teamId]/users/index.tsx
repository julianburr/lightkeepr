import "src/utils/firebase";

import { useMemo } from "react";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { useCollection } from "src/@packages/firebase";
import { AppLayout } from "src/layouts/app";
import { useAuthUser } from "src/hooks/use-auth-user";
import { Auth } from "src/components/auth";
import { Button } from "src/components/button";
import { List } from "src/components/list";
import { TitleBar } from "src/components/title-bar";
import { Spacer } from "src/components/spacer";
import { GroupHeading, Heading } from "src/components/text";
import { Loader } from "src/components/loader";
import { Suspense } from "src/components/suspense";

import { UserListItem } from "src/list-items/user";

import PlusSvg from "src/assets/icons/plus.svg";

const db = getFirestore();

function UsersList() {
  const router = useRouter();

  const teamRef = doc(db, "teams", router.query.teamId!);
  const teamUsers = useCollection(
    query(
      collection(db, "teamUsers"),
      where("team", "==", teamRef),
      orderBy("user", "asc")
    ),
    { key: `${router.query.teamId}/orgUsers` }
  );

  const { owners, others, pending } = useMemo(() => {
    return teamUsers.reduce(
      (all: any, teamUser: any) => {
        if (teamUser.status === "active") {
          if (teamUser.role === "owner") {
            all.owners.push(teamUser);
          } else {
            all.others.push(teamUser);
          }
        } else if (teamUser.status === "pending") {
          all.pending.push(teamUser);
        }
        return all;
      },
      { owners: [], others: [], pending: [] }
    );
  }, [teamUsers]);

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
          <List items={pending} Item={UserListItem} />
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
              {authUser.teamUser?.role === "owner" && (
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

        <Suspense fallback={<Loader />}>
          <UsersList />
        </Suspense>
      </AppLayout>
    </Auth>
  );
}
