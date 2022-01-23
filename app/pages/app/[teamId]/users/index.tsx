import "src/utils/firebase";

import { Suspense } from "react";
import { useRouter } from "next/router";
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
import { AppLayout } from "src/layouts/app";
import { useErrorDialog } from "src/hooks/use-dialog";
import { Auth } from "src/components/auth";
import { Button } from "src/components/button";
import { List, ListItem } from "src/components/list";
import { TitleBar } from "src/components/title-bar";
import { Spacer } from "src/components/spacer";
import { Tag } from "src/components/tag";
import { TagGroup } from "src/components/tag-group";

import PlusSvg from "src/assets/icons/plus.svg";

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
              await updateDoc(doc(db, "teamUsers", data.id), {
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
