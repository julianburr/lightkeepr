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

import { ReportListItem } from "src/list-items/report";
import { BackLink } from "src/components/back-link";

const db = getFirestore();

function ReportsList() {
  const router = useRouter();

  const runRef = doc(db, "runs", router.query.runId!);
  const runs = useCollection(
    query(
      collection(db, "reports"),
      where("run", "==", runRef),
      orderBy("name", "asc")
    ),
    { key: `${router.query.runId}/reports` }
  );

  return <List items={runs} Item={ReportListItem} />;
}

export default function RunDetails() {
  const router = useRouter();

  const { teamId, projectId, runId } = router.query;
  const run = useDocument(doc(db, "runs", runId!));

  return (
    <Auth>
      <AppLayout>
        <BackLink href={`/app/${teamId}/projects/${projectId}`}>
          Back to project overview
        </BackLink>
        <Heading level={1}>
          Run: {run.commitMessage || run.commitHash || "n/a"}
        </Heading>
        <Spacer h="1.8rem" />

        <Heading level={2}>Reports</Heading>
        <Spacer h="1.2rem" />
        <Suspense fallback={null}>
          <ReportsList />
        </Suspense>
      </AppLayout>
    </Auth>
  );
}
