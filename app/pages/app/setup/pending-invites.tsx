import "src/utils/firebase";

import { useCallback } from "react";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import styled from "styled-components";

import { useAuthUser } from "src/hooks/use-auth-user";
import { SetupLayout } from "src/layouts/setup";
import { Auth } from "src/components/auth";
import { List, ListItem } from "src/components/list";
import { Spacer } from "src/components/spacer";
import { P, Small } from "src/components/text";
import { SplitButton } from "src/components/split-button";
import { useDocument } from "src/@packages/firebase";

const db = getFirestore();

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

function InviteListItem({ data }: any) {
  const authUser = useAuthUser();

  const invitedBy = useDocument(doc(db, "users", data.createdBy.id));
  const teamRef = doc(db, "teams", data.team.id);

  const acceptInvite = useCallback(async () => {
    const newInviteStatus = { ...data.team.inviteStatus };
    delete newInviteStatus[authUser.email!];
    await updateDoc(teamRef, {
      invites: data.team.invites.filter(
        (email: string) => email !== authUser.email
      ),
      inviteStatus: newInviteStatus,
      users: data.team.users.concat([authUser.user!.id]),
      userRoles: { ...data.team.userRoles, [authUser.user!.id]: data.role },
    });
  }, [teamRef, authUser.user!.id, authUser.email, data.team, data.role]);

  const rejectInvite = useCallback(async () => {
    await updateDoc(teamRef, {
      inviteStatus: {
        ...data.team.inviteStatus,
        [authUser.email!]: {
          ...data.team.inviteStatus[authUser.email!],
          status: "rejected",
          rejectedAt: new Date(),
        },
      },
    });
  }, [teamRef, data.team, authUser.email]);

  return (
    <ListItem>
      <Container>
        <P>{data.team.name}</P>
        <Small grey>
          As {data.role === "billing" ? "billing manager" : data.role}{" "}
          —&nbsp;Invited by {invitedBy.email}
        </Small>
      </Container>
      <SplitButton
        onClick={acceptInvite}
        placement="bottom-end"
        items={[
          {
            label: "Reject invite",
            onClick: rejectInvite,
          },
        ]}
      >
        Accept
      </SplitButton>
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
