import "src/utils/firebase";

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
import { Suspense } from "src/components/suspense";

import { ReportListItem } from "src/list-items/report";

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

  return (
    <>
      <Heading level={2}>Reports</Heading>
      <Spacer h=".8rem" />

      {/* TODO: filters */}
      <List items={runs} Item={ReportListItem} />
    </>
  );
}

export default function RunDetails() {
  const router = useRouter();

  const { runId } = router.query;
  const run = useDocument(runId ? doc(db, "runs", runId) : undefined, {
    fetch: !!runId,
  });

  return (
    <Auth>
      <AppLayout>
        <Heading level={1}>
          {run.commitMessage || run.commitHash || run.id}
        </Heading>
        <Spacer h="2.4rem" />

        <Suspense fallback={null}>
          <ReportsList />
        </Suspense>
      </AppLayout>
    </Auth>
  );
}
