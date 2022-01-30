import "src/utils/firebase";

import { useMemo } from "react";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { useCollection } from "src/@packages/firebase";
import { AppLayout } from "src/layouts/app";
import { Auth } from "src/components/auth";
import { List } from "src/components/list";
import { Loader } from "src/components/loader";
import { Heading } from "src/components/text";
import { Spacer } from "src/components/spacer";
import { Suspense } from "src/components/suspense";

import { ProjectListItem } from "src/list-items/project";

const db = getFirestore();

function ProjectsList() {
  const router = useRouter();

  const teamId = router.query.teamId;
  const projects = useCollection(
    query(
      collection(db, "projects"),
      where("team", "==", doc(db, "teams", teamId!)),
      orderBy("name", "asc")
    ),
    { key: `${teamId}/projects` }
  );

  const items = useMemo(() => [...projects, { id: "new" }], [projects]);
  return <List columns={3} items={items} Item={ProjectListItem} />;
}

export default function TeamDashboard() {
  return (
    <Auth>
      <AppLayout>
        <Heading level={1}>Projects</Heading>
        <Spacer h="1.2rem" />

        <Suspense fallback={<Loader />}>
          <ProjectsList />
        </Suspense>
      </AppLayout>
    </Auth>
  );
}
