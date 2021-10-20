import { Suspense } from "react";
import { getFirestore, doc } from "firebase/firestore";
import { useRouter } from "next/router";
import Link from "next/link";

import { useDocument } from "src/@packages/firebase";
import { useSuspense } from "src/utils/suspense";
import { api } from "src/utils/api-client";

const db = getFirestore();

function Report() {
  const router = useRouter();
  const { reportId } = router.query;

  const reportData = useSuspense(
    () => api.get(`/api/reports/${reportId}`),
    `report--${reportId}`
  );

  return <pre>{JSON.stringify(reportData, null, 2)}</pre>;
}

export default function ReportDetailsScreen() {
  const router = useRouter();
  const { orgId, projectId, runId, reportId } = router.query;

  const report = useDocument(doc(db, "reports", reportId));

  return (
    <>
      <h1>Report</h1>

      <h2>Details</h2>
      <p>
        Run:{" "}
        <Link href={`/${orgId}/projects/${projectId}/runs/${runId}`}>
          {report.run.id}
        </Link>
      </p>
      <p>ID: {report.id}</p>
      <p>URL: {report.url}</p>

      <h2>Lighthouse</h2>
      <Suspense fallback={<p>Loading report...</p>}>
        <Report />
      </Suspense>
    </>
  );
}
