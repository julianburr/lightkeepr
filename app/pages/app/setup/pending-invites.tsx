import "src/utils/firebase";

import { doc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { useForm } from "react-cool-form";

import { useAuthUser } from "src/hooks/use-auth-user";
import { SetupLayout } from "src/layouts/setup";
import { Auth } from "src/components/auth";
import { List, ListItem } from "src/components/list";
import { useDocument } from "src/@packages/firebase";
import { Spacer } from "src/components/spacer";
import { useCallback } from "react";

const db = getFirestore();

function InviteListItem({ data }: any) {
  const team = useDocument(doc(db, "teams", data.team.id));

  const updateStatus = useCallback(
    (status) => {
      return updateDoc(doc(db, "teamUsers", data.id), {
        status,
      });
    },
    [data.id]
  );

  return (
    <ListItem
      title={team.name}
      meta={`Invited by ${data.createdBy.id}`}
      actions={[
        {
          label: "Accept invite",
          onClick: () => updateStatus("active"),
        },
        {
          label: "Reject invite",
          onClick: () => updateStatus("rejected"),
        },
        {
          label: "Reject & block",
          onClick: () => updateStatus("blocked"),
        },
      ]}
    />
  );
}

export default function PendingInvitesSetup() {
  const authUser = useAuthUser();

  return (
    <Auth>
      <SetupLayout>
        <h1>You have some pending invites</h1>
        <Spacer h="1.8rem" />

        <List items={authUser.pendingInvites || []} Item={InviteListItem} />
      </SetupLayout>
    </Auth>
  );
}
