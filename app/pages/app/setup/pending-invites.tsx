import "src/utils/firebase";

import { doc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { useForm } from "react-cool-form";

import { useAuthUser } from "src/hooks/use-auth-user";
import { SetupLayout } from "src/layouts/setup";
import { Auth } from "src/components/auth";
import { List, ListItem } from "src/components/list";
import { useDocument } from "src/@packages/firebase";
import { Spacer } from "src/components/spacer";

const db = getFirestore();

function InviteListItem({ data }: any) {
  const organisation = useDocument(
    doc(db, "organisations", data.organisation.id)
  );
  return (
    <ListItem
      title={organisation.name}
      meta={`Invited by ${data.createdBy.id}`}
      actions={[
        {
          label: "Accept invite",
          onClick: async () => {
            await updateDoc(doc(db, "organisationUsers", data.id), {
              status: "active",
            });
          },
        },
        {
          label: "Reject invite",
          onClick: async () => {
            await updateDoc(doc(db, "organisationUsers", data.id), {
              status: "rejected",
            });
          },
        },
        {
          label: "Reject & block",
          onClick: async () => {
            await updateDoc(doc(db, "organisationUsers", data.id), {
              status: "blocked",
            });
          },
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

        <List items={authUser.pendingOrganisationUsers} Item={InviteListItem} />
      </SetupLayout>
    </Auth>
  );
}
