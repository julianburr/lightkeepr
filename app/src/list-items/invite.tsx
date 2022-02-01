import "src/utils/firebase";

import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useMemo } from "react";
import styled from "styled-components";

import { useDocument } from "src/@packages/firebase";
import { ActionMenu } from "src/components/action-menu";
import { Avatar } from "src/components/avatar";
import { ListItem } from "src/components/list";
import { Spacer } from "src/components/spacer";
import { P, Small } from "src/components/text";
import { useAuthUser } from "src/hooks/use-auth-user";
import { useConfirmationDialog } from "src/hooks/use-dialog";
import { useToast } from "src/hooks/use-toast";
import { api } from "src/utils/api-client";

const db = getFirestore();

const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  gap: 1.2rem;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Email = styled(P)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

type UserItemProps = {
  data: any;
  items: any[];
};

export function InviteListItem({ data }: UserItemProps) {
  const router = useRouter();
  const authUser = useAuthUser();

  const confirmationDialog = useConfirmationDialog();
  const toast = useToast();

  const currentUserRef = doc(db, "users", authUser.uid!);

  const teamRef = doc(db, "teams", router.query.teamId!);
  const team = useDocument(teamRef);

  const actions = useMemo(() => {
    const ACTIONS = {
      REMOVE: {
        label: "Remove from team",
        onClick: () => {
          confirmationDialog.open({
            message: `Are you sure you want to remove ${data.email} from your team?`,
            onConfirm: async () => {
              const newInviteStatus = { ...(team.inviteStatus || {}) };
              delete newInviteStatus[data.email];
              await updateDoc(teamRef, {
                invites: team.invites?.filter?.(
                  (email: string) => email !== data.email
                ),
                inviteStatus: newInviteStatus,
              });
              toast.show({ message: "User has been removed from the team" });
            },
          });
        },
      },
      RESEND_INVITE: {
        label: "Resend invite email",
        onClick: async () => {
          await updateDoc(teamRef, {
            inviteStatus: {
              ...team.inviteStatus,
              [data.email]: {
                ...team.inviteStatus[data.email],
                status: "pending",
                createdAt: new Date(),
                createdBy: currentUserRef,
              },
            },
          });
          await api.post("/api/account/invite-user", {
            email: data.email,
            teamId: router.query.teamId,
          });
          toast.show({ message: "Invite email resent to user" });
        },
      },
    };

    return [ACTIONS.REMOVE, ACTIONS.RESEND_INVITE];
  }, [team.invites, team.inviteStatus, data.email]);

  return (
    <ListItem>
      <Content>
        <Avatar name={data.email} />
        <Title>
          <Email>{data.email}</Email>
          <Small grey>
            {data.status === "pending"
              ? "Pending"
              : data.status === "rejected"
              ? "Rejected"
              : data.status}
          </Small>
        </Title>
      </Content>
      <Spacer w="1.8rem" />
      {authUser.teamRole === "owner" && (
        <ActionMenu placement="bottom-end" items={actions} />
      )}
    </ListItem>
  );
}
