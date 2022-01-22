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
  const authUser = useAuthUser();

  const router = useRouter();
  const { orgUserId } = router.query;

  const orgId = authUser.organisationUser?.organisation?.id;
  const projects = useCollection(
    orgId
      ? query(
          collection(db, "projects"),
          where("organisation", "==", doc(db, "organisations", orgId))
        )
      : undefined,
    { key: `${orgUserId}/projects` }
  );

  return <List items={projects} Item={ProjectListItem} />;
}

export default function OrganisationDashboard() {
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
