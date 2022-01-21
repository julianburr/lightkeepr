import { Suspense } from "react";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

import { useCollection, useDocument } from "src/@packages/firebase";
import { useAuthUser } from "src/hooks/use-auth-user";
import { AppLayout } from "src/layouts/app";
import { Auth } from "src/components/auth";
import { Button } from "src/components/button";
import { List, ListItem } from "src/components/list";
import { P, Small } from "src/components/text";
import { TitleBar } from "src/components/title-bar";

import PlusSvg from "src/assets/icons/plus.svg";
import { Spacer } from "src/components/spacer";
import { InviteUserDialog } from "dialogs/invite-user";
import { useDialog } from "src/hooks/use-dialog";

const db = getFirestore();

type UserItemProps = {
  data: any;
};

function UserItems() {
  const authUser = useAuthUser();

  const orgId = authUser.organisationUser?.organisation?.id;
  const orgRef = doc(db, "organisations", orgId);
  const organisationUsers = useCollection(
    query(
      collection(db, "organisationUsers"),
      where("organisation", "==", orgRef)
    ),
    { key: "orgUsers" }
  );

  return <List items={organisationUsers} Item={UserItem} />;
}

function UserItem({ data }: UserItemProps) {
  const user = useDocument(doc(db, "users", data.user.id));
  return (
    <ListItem>
      <P>{data.user.id}</P>
      <Small grey>{user?.name || "—"}</Small>
    </ListItem>
  );
}

export default function Users() {
  const inviteUserDialog = useDialog(InviteUserDialog);
  return (
    <Auth>
      <AppLayout>
        <TitleBar
          title="Users"
          actions={
            <Button icon={<PlusSvg />} onClick={() => inviteUserDialog.open()}>
              Invite new user
            </Button>
          }
        />
        <Spacer h="1.2rem" />
        <Suspense fallback={null}>
          <UserItems />
        </Suspense>
      </AppLayout>
    </Auth>
  );
}
