import "src/utils/firebase";

import {
  collection,
  doc,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { useCollection } from "src/@packages/firebase";
import { Auth } from "src/components/auth";
import { List } from "src/components/list";
import { Spacer } from "src/components/spacer";
import { Heading } from "src/components/text";
import { useAuthUser } from "src/hooks/use-auth-user";
import { AppLayout } from "src/layouts/app";
import { NotificationListItem } from "src/list-items/notification";

const db = getFirestore();

function Content() {
  const authUser = useAuthUser();

  const userRef = doc(db, "users", authUser.user!.id);
  const teamRef = doc(db, "teams", authUser.team!.id);
  const notifications = useCollection(
    query(
      collection(db, "notifications"),
      where("user", "==", userRef),
      where("team", "==", teamRef),
      orderBy("createdAt", "desc")
    ),
    { key: `${authUser.user!.id}/notifications` }
  );

  return (
    <>
      <Heading level={1}>Notifications</Heading>
      <Spacer h="1.2rem" />
      <List items={notifications} Item={NotificationListItem} />
    </>
  );
}

export default function Notifications() {
  return (
    <Auth>
      <AppLayout>
        <Content />
      </AppLayout>
    </Auth>
  );
}
