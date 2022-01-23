import "src/utils/firebase";

import { Suspense } from "react";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { useCollection, useDocument } from "src/@packages/firebase";
import { AppLayout } from "src/layouts/app";
import { Auth } from "src/components/auth";
import { List } from "src/components/list";
import { Spacer } from "src/components/spacer";
import { Heading, P } from "src/components/text";

import { RunListItem } from "src/list-items/run";

const db = getFirestore();

function RunsList() {
  const router = useRouter();

  const projectRef = doc(db, "projects", router.query.projectId!);
  const runs = useCollection(
    query(
      collection(db, "runs"),
      where("project", "==", projectRef),
      orderBy("createdAt", "desc")
    ),
    { key: `${router.query.projectId}/runs` }
  );

  return <List items={runs} Item={RunListItem} />;
}

export default function ProjectDetails() {
  const router = useRouter();

  const project = useDocument(doc(db, "projects", router.query.projectId!));

  return (
    <Auth>
      <AppLayout>
        <Heading level={1}>{project.name}</Heading>
        <Spacer h="1.8rem" />

        <Heading level={2}>Suggested improvements</Heading>
        <Spacer h=".6rem" />
        <P>Suggestions are not implemented yet.</P>
        <Spacer h="1.8rem" />

        <Heading level={2}>Runs</Heading>
        <Spacer h="1.2rem" />
        <Suspense fallback={null}>
          <RunsList />
        </Suspense>
      </AppLayout>
    </Auth>
  );
}
