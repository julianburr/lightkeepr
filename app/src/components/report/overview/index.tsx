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
import { Loader } from "src/components/loader";
import { Spacer } from "src/components/spacer";
import { Suspense } from "src/components/suspense";
import { Heading } from "src/components/text";

import { BudgetsOverview } from "./budgets";
import { NetworkOverview } from "./network";
import { OpportunitiesOverview } from "./opportunities";
import { PerformanceOverview } from "./performance";
import { ScoresOverview } from "./scores";
import { UserTimingsOverview } from "./user-timings";

const db = getFirestore();

type ReportOverviewProps = {
  report: any;
  reportData: any;
  stepIndex: number;
};

function Content({ report, reportData, stepIndex }: ReportOverviewProps) {
  const projectRef = doc(db, "projects", report.project.id);
  const project = useDocument(projectRef);

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
      {!!reportData.audits?.["performance-budget"]?.details?.items?.length &&
        !!reportData.audits?.["performance-budget"]?.details?.items?.length && (
          <>
            <Heading level={2}>Budgets</Heading>
            <BudgetsOverview
              report={report}
              pastReports={pastReports}
              reportData={reportData}
              stepIndex={stepIndex}
            />

            <Spacer h="3.2rem" />
          </>
        )}

      <Heading level={2}>Opportunities</Heading>
      <OpportunitiesOverview
        report={report}
        pastReports={pastReports}
        reportData={reportData}
      />

      <Spacer h="3.2rem" />

      <Heading level={2}>Trends &amp; regressions</Heading>
      <Spacer h="2.4rem" />
      <ScoresOverview
        report={report}
        pastReports={pastReports}
        reportData={reportData}
        stepIndex={stepIndex}
      />

      <Spacer h="3.2rem" />
      <PerformanceOverview
        report={report}
        pastReports={pastReports}
        reportData={reportData}
        stepIndex={stepIndex}
      />

      <Spacer h="3.2rem" />
      <NetworkOverview
        report={report}
        pastReports={pastReports}
        reportData={reportData}
        stepIndex={stepIndex}
      />

      <Spacer h="3.2rem" />
      <UserTimingsOverview
        report={report}
        pastReports={pastReports}
        reportData={reportData}
        stepIndex={stepIndex}
      />
    </>
  );
}

export function ReportOverview(props: ReportOverviewProps) {
  return (
    <Suspense fallback={<Loader message="Loading past reports..." />}>
      <Content {...props} />
    </Suspense>
  );
}
