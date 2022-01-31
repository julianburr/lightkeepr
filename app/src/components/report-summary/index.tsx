import "src/utils/firebase";

import {
  collection,
  doc,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { useSuspense } from "src/@packages/suspense";
import { useCollection, useDocument } from "src/@packages/firebase";
import { api } from "src/utils/api-client";
import { Spacer } from "src/components/spacer";
import { Loader } from "src/components/loader";
import { Suspense } from "src/components/suspense";

import { ScoresSummary } from "./scores";
import { PerformanceSummary } from "./performance";
import { NetworkSummary } from "./network";
import { UserTimingsSummary } from "./user-timings";
import { OpportunitiesSummary } from "./opportunities";

const db = getFirestore();

type ReportSummaryProps = {
  reportId: string;
};

function Summary({ reportId }: ReportSummaryProps) {
  const report = useDocument(doc(db, "reports", reportId!));

  const projectRef = doc(db, "projects", report.project.id);
  const project = useDocument(projectRef);

  const { data } = useSuspense(() => api.get(`/api/reports/${reportId}`), {
    key: `report/${reportId}`,
  });

  const pastReports = useCollection(
    report?.project?.id &&
      query(
        collection(db, "reports"),
        where("project", "==", projectRef),
        where("name", "==", report.name),
        where("branch", "==", project.gitMain),
        where("createdAt", "<=", report.createdAt),
        orderBy("createdAt", "desc")
      ),
    {
      key: `${report?.id}/pastReports`,
      fetch: !!report?.project?.id,
    }
  );

  return (
    <>
      {/* TODO: add budgets */}

      <h2>Opportunities</h2>
      <OpportunitiesSummary
        report={report}
        pastReports={pastReports}
        data={data}
      />

      <Spacer h="3.2rem" />

      <h2>Trends &amp; regressions</h2>
      <Spacer h="2.4rem" />
      <ScoresSummary report={report} pastReports={pastReports} data={data} />

      <Spacer h="3.2rem" />
      <PerformanceSummary
        report={report}
        pastReports={pastReports}
        data={data}
      />

      <Spacer h="3.2rem" />
      <NetworkSummary report={report} pastReports={pastReports} data={data} />

      <Spacer h="3.2rem" />
      <UserTimingsSummary
        report={report}
        pastReports={pastReports}
        data={data}
      />
    </>
  );
}

export function ReportSummary({ reportId }: ReportSummaryProps) {
  return (
    <>
      <Suspense fallback={<Loader message="Loading past reports..." />}>
        <Summary reportId={reportId} />
      </Suspense>
    </>
  );
}
