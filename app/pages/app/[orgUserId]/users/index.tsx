import "src/utils/firebase";

import { Suspense } from "react";
import {
  collection,
  doc,
  getFirestore,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { useCollection, useDocument } from "src/@packages/firebase";
import { useAuthUser } from "src/hooks/use-auth-user";
import { AppLayout } from "src/layouts/app";
import { Auth } from "src/components/auth";
import { Button } from "src/components/button";
import { List, ListItem } from "src/components/list";
import { TitleBar } from "src/components/title-bar";

import { Spacer } from "src/components/spacer";
import { useErrorDialog } from "src/hooks/use-dialog";
import { Tag } from "src/components/tag";
import { TagGroup } from "src/components/tag-group";

import PlusSvg from "src/assets/icons/plus.svg";
import { useRouter } from "next/router";

const db = getFirestore();

type UserItemProps = {
  data: any;
};

function UserListItem({ data }: UserItemProps) {
  const errorDialog = useErrorDialog();
  const user = useDocument(doc(db, "users", data.user.id));

  const actions =
    data.status === "pending"
      ? [
          { label: "Resend invite email" },
          { label: "Remove from organisation" },
        ]
      : data.status === "rejected"
      ? [
          {
            label: "Re-invite to organisation",
            onClick: async () => {
              await updateDoc(doc(db, "organisationUsers", data.id), {
                status: "pending",
              });
            },
          },
          { label: "Remove from organisation" },
        ]
      : data.role !== "owner"
      ? [{ label: "Make owner" }, { label: "Remove from organisation" }]
      : [
          {
            label: "Remove from organisation",
            onClick: () =>
              errorDialog.open(
                new Error("Cannot delete the only owner of an organisation.")
              ),
          },
        ];

  return (
    <ListItem
      title={data.user.id}
      meta={user?.name || "—"}
      tags={
        <TagGroup>
          {data.status === "pending" && <Tag label="pending" />}
          {data.status === "rejected" && <Tag label="rejected" />}
          <Tag label={data.role} />
        </TagGroup>
      }
      actions={actions}
    />
  );
}

function UsersList() {
  const router = useRouter();
  const authUser = useAuthUser();

  const orgId = authUser.organisationUser?.organisation?.id;
  const orgRef = doc(db, "organisations", orgId);
  const organisationUsers = useCollection(
    query(
      collection(db, "organisationUsers"),
      where("organisation", "==", orgRef),
      orderBy("user", "asc")
    ),
    { key: `${router.query.orgUserId}/orgUsers` }
  );

  return <List items={organisationUsers} Item={UserListItem} />;
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
              href={`/app/${router.query.orgUserId}/users/new`}
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
