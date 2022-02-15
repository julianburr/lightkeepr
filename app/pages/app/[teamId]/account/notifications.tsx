import { Auth } from "src/components/auth";
import { List } from "src/components/list";
import { Spacer } from "src/components/spacer";
import { Heading } from "src/components/text";
import { useAuthUser } from "src/hooks/use-auth-user";
import { AppLayout } from "src/layouts/app";
import { NotificationListItem } from "src/list-items/notification";

function Content() {
  const authUser = useAuthUser();

  return (
    <>
      <Heading level={1}>Notifications</Heading>
      <Spacer h="1.2rem" />
      <List
        items={authUser.user?.notifications?.[authUser!.team!.id] || []}
        Item={NotificationListItem}
      />
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
