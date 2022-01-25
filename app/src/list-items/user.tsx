import "src/utils/firebase";

import { useMemo } from "react";
import styled from "styled-components";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";

import { useAuth, useDocument } from "src/@packages/firebase";
import { api } from "src/utils/api-client";
import { useAuthUser } from "src/hooks/use-auth-user";
import { useConfirmationDialog, useErrorDialog } from "src/hooks/use-dialog";
import { useToast } from "src/hooks/use-toast";
import { ActionMenu } from "src/components/action-menu";
import { Avatar } from "src/components/avatar";
import { ListItem } from "src/components/list";
import { Spacer } from "src/components/spacer";
import { P, Small } from "src/components/text";

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

export function UserListItem({ data, items }: UserItemProps) {
  const toast = useToast();
  const errorDialog = useErrorDialog();
  const confirmationDialog = useConfirmationDialog();

  const authUser = useAuthUser();
  const user = useDocument(doc(db, "users", data.user.id));

  const actions = useMemo(() => {
    const isOnlyOwner =
      data.role === "owner" &&
      !items.find((item: any) => item.role === "owner" && item.id !== data.id);

    const ACTIONS = {
      RESEND_INVITE: {
        label: "Resend invite email",
        onClick: async () => {
          await api.post("/api/account/invite-user", {
            teamUserId: data.id,
          });
          toast.show({ message: "Invite email resend to user" });
        },
      },

      REMOVE: {
        label: "Remove from team",
        onClick: () => {
          if (isOnlyOwner) {
            errorDialog.open({
              message:
                `You cannot delete this user since they are the only team owner at ` +
                `the moment. Please make another user owner first.`,
            });
            return;
          }

          confirmationDialog.open({
            message: (
              <>
                Are you sure you want to remove{" "}
                <b>
                  {authUser.teamUser?.id === data.id
                    ? "yourself"
                    : data.user.id}
                </b>{" "}
                from your team?
              </>
            ),
            onConfirm: async () => {
              await deleteDoc(doc(db, "teamUsers", data.id));
            },
          });
        },
      },

      UPDATE_ROLE: ({ label, role }: { label: string; role: string }) => ({
        label: `Change to ${label}`,
        onClick: async () => {
          if (role !== "owner") {
            if (data.role === "owner" && data.id === authUser.teamUser?.id) {
              errorDialog.open({
                message:
                  `You cannot remove the owner role from yourself. Please ` +
                  `ask another owner to change your role.`,
              });
              return;
            }

            if (isOnlyOwner) {
              errorDialog.open({
                message:
                  `You cannot update the role of this user, because they ` +
                  `are the only team owner at the moment. Make another user owner ` +
                  `first.`,
              });
              return;
            }
          }
          await updateDoc(doc(db, "teamUsers", data.id), { role });
          toast.show({ message: "User role has been updated" });
        },
      }),
    };

    if (data.status === "pending") {
      return [ACTIONS.REMOVE, ACTIONS.RESEND_INVITE];
    }

    return [
      ACTIONS.REMOVE,
      {
        label: "Change user role",
        items: [
          { label: "owner", role: "owner" },
          { label: "billing manager", role: "billing" },
          { label: "normal member", role: "member" },
        ]
          .filter((item) => item.role !== data.role)
          .map((item) => ACTIONS.UPDATE_ROLE(item)),
      },
    ];
  }, [data.status, data.id, authUser.teamUser?.id]);

  return (
    <ListItem>
      <Content>
        <Avatar name={user?.name || data.user?.id} />
        <Title>
          <Email>{data.user.id}</Email>
          <Small grey>
            {data.status === "active"
              ? data.role === "billing"
                ? `${user?.name} — Billing manager`
                : user?.name
              : user?.name
              ? user.name
              : "—"}
          </Small>
        </Title>
      </Content>
      <Spacer w="1.8rem" />
      {authUser.teamUser?.role === "owner" && (
        <ActionMenu placement="bottom-end" items={actions} />
      )}
    </ListItem>
  );
}
