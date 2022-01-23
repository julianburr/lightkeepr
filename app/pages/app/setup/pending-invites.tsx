import "src/utils/firebase";

import { useCallback } from "react";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import styled from "styled-components";

import { useDocument } from "src/@packages/firebase";
import { useAuthUser } from "src/hooks/use-auth-user";
import { SetupLayout } from "src/layouts/setup";
import { Auth } from "src/components/auth";
import { List, ListItem } from "src/components/list";
import { Spacer } from "src/components/spacer";
import { P, Small } from "src/components/text";
import { ActionMenu } from "src/components/action-menu";
import { ActionButton } from "src/components/action-button";

const db = getFirestore();

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

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
    <ListItem>
      <Container>
        <P>{team.name}</P>
        <Small grey>Invited by {data.createdBy.id}</Small>
      </Container>
      <ActionButton
        onClick={() => updateStatus("active")}
        placement="bottom-end"
        items={[
          {
            label: "Reject invite",
            onClick: () => updateStatus("rejected"),
          },
          {
            label: "Reject & block",
            onClick: () => updateStatus("blocked"),
          },
        ]}
      >
        Accept
      </ActionButton>
    </ListItem>
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
