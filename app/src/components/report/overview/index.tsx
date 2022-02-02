import "src/utils/firebase";

import {
  collection,
  doc,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { useCollection, useDocument } from "src/@packages/firebase";
import { useSuspense } from "src/@packages/suspense";
import { Loader } from "src/components/loader";
import { Spacer } from "src/components/spacer";
import { Suspense } from "src/components/suspense";
import { Heading } from "src/components/text";
import { api } from "src/utils/api-client";

import { BudgetsOverview } from "./budgets";
import { NetworkOverview } from "./network";
import { OpportunitiesOverview } from "./opportunities";
import { PerformanceOverview } from "./performance";
import { ScoresOverview } from "./scores";
import { UserTimingsOverview } from "./user-timings";

const db = getFirestore();

type ReportOverviewProps = {
  reportId: string;
};

function Content({ reportId }: ReportOverviewProps) {
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
        orderBy("createdAt", "desc"),
        limit(50)
      ),
    {
      key: `${report?.id}/pastReports`,
      fetch: !!report?.project?.id,
    }
  );

  return (
    <>
      {!!data.report.audits?.["performance-budget"]?.details?.items?.length &&
        !!data.report.audits?.["performance-budget"]?.details?.items
          ?.length && (
          <>
            <Heading level={2}>Budgets</Heading>
            <BudgetsOverview
              report={report}
              pastReports={pastReports}
              data={data}
            />

            <Spacer h="3.2rem" />
          </>
        )}

      <Heading level={2}>Opportunities</Heading>
      <OpportunitiesOverview
        report={report}
        pastReports={pastReports}
        data={data}
      />

      <Spacer h="3.2rem" />

      <Heading level={2}>Trends &amp; regressions</Heading>
      <Spacer h="2.4rem" />
      <ScoresOverview report={report} pastReports={pastReports} data={data} />

      <Spacer h="3.2rem" />
      <PerformanceOverview
        report={report}
        pastReports={pastReports}
        data={data}
      />

      <Spacer h="3.2rem" />
      <NetworkOverview report={report} pastReports={pastReports} data={data} />

      <Spacer h="3.2rem" />
      <UserTimingsOverview
        report={report}
        pastReports={pastReports}
        data={data}
      />
    </>
  );
}

export function ReportOverview({ reportId }: ReportOverviewProps) {
  return (
    <Suspense fallback={<Loader message="Loading past reports..." />}>
      <Content reportId={reportId} />
    </Suspense>
  );
}
