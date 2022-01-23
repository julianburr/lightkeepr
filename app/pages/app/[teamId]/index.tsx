import "src/utils/firebase";

import { Suspense } from "react";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

import { useCollection } from "src/@packages/firebase";
import { useAuthUser } from "src/hooks/use-auth-user";
import { AppLayout } from "src/layouts/app";
import { Auth } from "src/components/auth";
import { List, ListItem } from "src/components/list";

const db = getFirestore();

function ProjectListItem({ data }: any) {
  return <ListItem title={data.name} />;
}

function ProjectsList() {
  const router = useRouter();

  const teamId = router.query.teamId;
  const projects = useCollection(
    query(
      collection(db, "projects"),
      where("team", "==", doc(db, "teams", teamId!))
    ),
    { key: `${teamId}/projects` }
  );

  return <List items={projects} Item={ProjectListItem} />;
}

export default function TeamDashboard() {
  return (
    <Auth>
      <AppLayout>
        <Suspense fallback={null}>
          <ProjectsList />
        </Suspense>
      </AppLayout>
    </Auth>
  );
}
