import "src/utils/firebase";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useCallback } from "react";
import styled from "styled-components";

import { ActionMenu } from "src/components/action-menu";
import { Avatar } from "src/components/avatar";
import { Button } from "src/components/button";
import { ListItem } from "src/components/list";
import { P, Small } from "src/components/text";
import { Tooltip } from "src/components/tooltip";
import { useConfirmationDialog } from "src/dialogs/confirm";
import { useAuthUser } from "src/hooks/use-auth-user";
import { useToast } from "src/hooks/use-toast";
import { getNotificationIcon } from "src/utils/notifications";

import LinkSvg from "src/assets/icons/outline/link.svg";

dayjs.extend(relativeTime);

const db = getFirestore();

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  gap: 1.2rem;
`;

const Content = styled.div`
  align-self: center;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const UnseenBadge = styled.button<{ seen: boolean }>`
  display: flex;
  background: transparent;
  border: 0 none;
  pointer-events: ${(props) => (props.seen ? "none" : "all")};
  margin: -0.4rem;
  padding: 0.6rem;

  &:before {
    content: " ";
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    background: var(--sol--color-brand-500);
    transition: background 0.2s, opacity 0.1s ease-in-out,
      transform 0.1s ease-in-out;
    opacity: ${(props) => (props.seen ? 0 : 1)};
    transform: ${(props) => (props.seen ? `scale(.8)` : `scale(1)`)};
  }

  &:hover,
  &:focus {
    &:before {
      background: var(--sol--color-brand-600);
    }
  }
`;

const WrapActionMenu = styled.div`
  padding: 0.4rem 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.4rem;
`;

export function NotificationListItem({ data }: any) {
  const authUser = useAuthUser();

  const userRef = doc(db, "users", authUser.uid!);
  const teamId = authUser?.team?.id;
  const notifications = authUser.user?.notifications;

  const toast = useToast();
  const confirmationDialog = useConfirmationDialog();

  const markAsSeen = useCallback(
    async (value) => {
      const seenAt = value ? new Date() : null;
      await updateDoc(userRef, {
        notifications: {
          ...notifications,
          [teamId!]: (notifications?.[teamId!] || []).map((notification) =>
            notification.id === data.id
              ? { ...notification, seenAt }
              : notification
          ),
        },
      });
    },
    [data.id, notifications]
  );

  const deleteNotification = useCallback(() => {
    confirmationDialog.open({
      message: "Are you sure you want to delete this notification?",
      confirmLabel: "Delete",
      intent: "danger",
      onConfirm: async () => {
        await updateDoc(userRef, {
          notifications: {
            ...notifications,
            [teamId!]: (notifications?.[teamId!] || []).filter(
              (notification) => notification.id !== data.id
            ),
          },
        });
        toast.show({ message: "Notification deleted successfully" });
      },
    });
  }, [data.id, notifications]);

  return (
    <ListItem>
      <Container>
        <Avatar
          badge={
            <Tooltip content="Mark as seen">
              {(props) => (
                <UnseenBadge
                  {...props}
                  seen={!!data.seenAt}
                  onClick={() => markAsSeen(true)}
                />
              )}
            </Tooltip>
          }
        >
          {getNotificationIcon(data.type)}
        </Avatar>
        <Content>
          <P>{data.title}</P>
          <Small grey>
            {dayjs.unix(data.createdAt?.seconds).fromNow()} —&nbsp;
            {data.description}
          </Small>
        </Content>
        <WrapActionMenu>
          {data.href && (
            <Tooltip content="Go to resource">
              {(props) => (
                <Button
                  intent="ghost"
                  icon={<LinkSvg />}
                  {...props}
                  href={{
                    pathname: data.href,
                    query: {
                      nid: data.id,
                    },
                  }}
                />
              )}
            </Tooltip>
          )}
          <ActionMenu
            placement="bottom-end"
            items={[
              {
                label: data.seenAt ? "Mark as unseen" : "Mark as seen",
                onClick: () => markAsSeen(!data.seenAt),
              },
              {
                items: [
                  {
                    label: "Delete notification",
                    onClick: deleteNotification,
                    intent: "danger",
                  },
                ],
              },
            ]}
          />
        </WrapActionMenu>
      </Container>
    </ListItem>
  );
}
