import "src/utils/firebase";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useEffect } from "react";
import styled from "styled-components";

import { Badge } from "src/components/badge";
import { Button } from "src/components/button";
import { Popout } from "src/components/popout";
import { PopoutMenu } from "src/components/popout-menu";
import { Spacer } from "src/components/spacer";
import { Suspense } from "src/components/suspense";
import { P } from "src/components/text";
import { useAuthUser } from "src/hooks/use-auth-user";
import { getNotificationIcon } from "src/utils/notifications";

import BellSvg from "src/assets/icons/outline/bell.svg";

dayjs.extend(relativeTime);

const db = getFirestore();

const Container = styled.div`
  width: 100%;
  max-width: 30rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EmptyContainer = styled.div`
  width: 100%;
  max-width: 30rem;
  padding: 2.4rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  p {
    margin: 0;
  }
`;

function Content({ setVisible, element }: any) {
  const authUser = useAuthUser();
  const router = useRouter();

  const notifications =
    authUser.user?.notifications?.[authUser!.team!.id] || [];

  const unread = useMemo(
    () =>
      notifications
        .filter((notification) => !notification.seenAt)
        .map((notification) => ({
          icon: getNotificationIcon(notification.type),
          label: notification.title,
          description: (
            <>
              {dayjs.unix(notification.createdAt?.seconds).fromNow()} —&nbsp;
              {notification.description}
            </>
          ),
          href: notification.href
            ? `${notification.href}?nid=${notification.id}`
            : `#`,
        })),
    [notifications]
  );

  if (!unread.length) {
    return (
      <EmptyContainer>
        <P grey>You currently have no unseen notifications.</P>
        <Spacer h="1.6rem" />
        <Button
          href={`/app/${router.query.teamId}/account/notifications`}
          intent="ghost"
        >
          Go to inbox
        </Button>
      </EmptyContainer>
    );
  }

  return (
    <Container>
      <PopoutMenu items={unread} setVisible={setVisible} element={element} />
      <Spacer h="1.2rem" />
      <Button
        href={`/app/${router.query.teamId}/account/notifications`}
        intent="ghost"
      >
        Go to inbox
      </Button>
      <Spacer h="1.6rem" />
    </Container>
  );
}

function PopoutContent(props: any) {
  return (
    <Suspense fallback={null}>
      <Content {...props} />
    </Suspense>
  );
}

export function NotificationsButton() {
  const authUser = useAuthUser();
  const router = useRouter();

  const teamId = authUser!.team!.id;
  const notifications = authUser.user?.notifications || {};

  const unread = useMemo(
    () =>
      notifications?.[teamId]?.filter?.((notification) => !notification.seenAt),
    [notifications]
  );

  useEffect(() => {
    if (router.query.nid) {
      updateDoc(doc(db, "users", authUser.uid!), {
        notifications: {
          ...notifications,
          [teamId]:
            notifications[teamId]?.map?.((notification) => {
              return notification.id === router.query.nid
                ? { ...notification, seenAt: new Date() }
                : notification;
            }) || [],
        },
      });
    }
  }, [router.query.nid]);

  return (
    <Popout Content={PopoutContent}>
      {(props) => (
        <Button
          icon={<BellSvg />}
          badge={<Badge count={unread?.length} />}
          {...props}
        />
      )}
    </Popout>
  );
}
