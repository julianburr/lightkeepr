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
import { BackLink } from "src/components/back-link";

import { ReportListItem } from "src/list-items/report";
import { Value } from "src/components/value";
import dayjs from "dayjs";

const db = getFirestore();

function ReportsList() {
  const router = useRouter();

  const runRef = doc(db, "runs", router.query.runId!);
  const runs = useCollection(
    query(
      collection(db, "reports"),
      where("run", "==", runRef),
      orderBy("createdAt", "asc")
    ),
    { key: `${router.query.runId}/reports` }
  );

  return <List items={runs} Item={ReportListItem} />;
}

export default function RunDetails() {
  const router = useRouter();

  const { teamId, projectId, runId } = router.query;
  const run = useDocument(doc(db, "runs", runId!));

  console.log({ run });

  return (
    <Auth>
      <AppLayout>
        <BackLink href={`/app/${teamId}/projects/${projectId}`}>
          Back to project overview
        </BackLink>
        <Heading level={1}>
          Run: {run.commitMessage || run.commitHash || run.id}
        </Heading>
        <Spacer h="2.4rem" />

        <Value horizontal label="Status" value={run.status} />
        <Spacer h=".4rem" />
        <Value horizontal label="Type" value={run.type} />
        <Spacer h=".4rem" />
        <Value
          horizontal
          label="Started"
          value={
            run.startedAt
              ? dayjs(run.startedAt.seconds * 1000).format("D MMM YYYY h:mma")
              : null
          }
        />
        <Spacer h=".4rem" />
        <Value
          horizontal
          label="Finished"
          value={
            run.finishedAt
              ? dayjs(run.finishedAt.seconds * 1000).format("D MMM YYYY h:mma")
              : null
          }
        />

        <Spacer h="2.8rem" />

        <Heading level={2}>Reports</Heading>
        <Spacer h="1.2rem" />
        <Suspense fallback={null}>
          <ReportsList />
        </Suspense>
      </AppLayout>
    </Auth>
  );
}
