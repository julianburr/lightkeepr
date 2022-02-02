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
import { useConfirmationDialog } from "src/dialogs/confirm";
import { useErrorDialog } from "src/dialogs/error";
import { useAuthUser } from "src/hooks/use-auth-user";
import { useToast } from "src/hooks/use-toast";

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
  const router = useRouter();
  const authUser = useAuthUser();

  const toast = useToast();
  const errorDialog = useErrorDialog();
  const confirmationDialog = useConfirmationDialog();

  const user = useDocument(doc(db, "users", data.userId));

  const teamRef = doc(db, "teams", router.query.teamId!);
  const team = useDocument(teamRef);

  const actions = useMemo(() => {
    const isOnlyOwner =
      data.role === "owner" &&
      !items.find(
        (item: any) => item.role === "owner" && item.userId !== user.id
      );

    const ACTIONS = {
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
                <b>{authUser.uid === user.id ? "yourself" : user.email}</b> from
                your team?
              </>
            ),
            onConfirm: async () => {
              const newUserRoles = { ...(team.userRoles || {}) };
              delete newUserRoles[user.id];
              await updateDoc(teamRef, {
                users: team.users?.filter?.((id: string) => id !== user.id),
                userRoles: newUserRoles,
              });
              toast.show({ message: "User has been removed from the team" });
            },
          });
        },
      },

      UPDATE_ROLE: ({ label, role }: { label: string; role: string }) => ({
        label: `Change to ${label}`,
        onClick: async () => {
          if (role !== "owner") {
            if (data.role === "owner" && user.id === authUser.uid) {
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
          await updateDoc(teamRef, {
            userRoles: { ...(team.userRoles || {}), [user.id]: role },
          });
          toast.show({ message: "User role has been updated" });
        },
      }),
    };

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
  }, [data.role, team.users, team.userRoles, user.id, authUser.uid]);

  return (
    <ListItem>
      <Content>
        <Avatar name={user.name || user.email} />
        <Title>
          <Email>{user.email}</Email>
          <Small grey>
            {data.role === "billing"
              ? `${user?.name} — Billing manager`
              : user?.name}
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
