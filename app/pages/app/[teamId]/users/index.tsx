import "src/utils/firebase";

import { Suspense } from "react";
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
import { Auth } from "src/components/auth";
import { Button } from "src/components/button";
import { List } from "src/components/list";
import { TitleBar } from "src/components/title-bar";
import { Spacer } from "src/components/spacer";

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

  return <List items={teamUsers} Item={UserListItem} />;
}

export default function Users() {
  const router = useRouter();

  return (
    <Auth>
      <AppLayout>
        <TitleBar
          title="Users"
          actions={
            <Button
              icon={<PlusSvg />}
              href={`/app/${router.query.teamId}/users/new`}
            >
              Invite new user
            </Button>
          }
        />

        <Spacer h="1.2rem" />

        <Suspense fallback={null}>
          <UsersList />
        </Suspense>
      </AppLayout>
    </Auth>
  );
}
