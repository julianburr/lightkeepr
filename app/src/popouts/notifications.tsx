import "src/utils/firebase";

import {
  collection,
  doc,
  getFirestore,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useEffect } from "react";
import styled from "styled-components";

import { useCollection } from "src/@packages/firebase";
import { Badge } from "src/components/badge";
import { Button } from "src/components/button";
import { Popout } from "src/components/popout";
import { PopoutMenu } from "src/components/popout-menu";
import { Spacer } from "src/components/spacer";
import { Suspense } from "src/components/suspense";
import { P } from "src/components/text";
import { useAuthUser } from "src/hooks/use-auth-user";

import BellSvg from "src/assets/icons/bell.svg";
import ZapSvg from "src/assets/icons/zap.svg";

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

  const userRef = doc(db, "users", authUser.user!.id);
  const teamRef = doc(db, "teams", authUser.team!.id);
  const notifications = useCollection(
    query(
      collection(db, "notifications"),
      where("user", "==", userRef),
      where("team", "==", teamRef),
      where("seen", "==", false),
      orderBy("createdAt", "desc")
    ),
    { key: `${authUser.user!.id}/unseenNotifications` }
  );

  const unread = useMemo(
    () =>
      notifications.map((notification: any) => ({
        icon: <ZapSvg />,
        label: notification.title,
        description: notification.description,
        href: {
          pathname: notification.href,
          query: {
            nid: notification.id,
          },
        },
      })),
    []
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
  const router = useRouter();
  const authUser = useAuthUser();

  const userRef = doc(db, "users", authUser.user!.id);
  const teamRef = doc(db, "teams", authUser.team!.id);
  const { data: notifications } = useCollection(
    query(
      collection(db, "notifications"),
      where("user", "==", userRef),
      where("team", "==", teamRef),
      where("seen", "==", false),
      orderBy("createdAt", "desc")
    ),
    {
      key: `${authUser.user!.id}/unseenNotifications`,
      suspense: false,
    }
  );

  useEffect(() => {
    if (router.query.nid) {
      updateDoc(doc(db, "notifications", router.query.nid), {
        seen: true,
      });
    }
  }, [router.query.nid]);

  return (
    <Popout Content={PopoutContent}>
      {(props) => (
        <Button
          icon={<BellSvg />}
          badge={<Badge count={notifications?.length} />}
          {...props}
        />
      )}
    </Popout>
  );
}
