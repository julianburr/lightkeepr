import "src/utils/firebase";

import { doc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";
import styled from "styled-components";

import { useDocument } from "src/@packages/firebase";
import { useSuspense } from "src/@packages/suspense";
import { Auth } from "src/components/auth";
import { Loader } from "src/components/loader";
import { ReportActions } from "src/components/report/actions";
import { ReportDetails } from "src/components/report/details";
import { ReportScores } from "src/components/report/scores";
import { ReportStatus } from "src/components/report/status";
import { Spacer } from "src/components/spacer";
import { Suspense } from "src/components/suspense";
import { Heading, P } from "src/components/text";
import { AppLayout } from "src/layouts/app";
import { api } from "src/utils/api-client";

const db = getFirestore();

const WrapTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  @media (min-width: 800px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const WrapHeading = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 800px) {
    flex: 1;
  }
`;

function Content() {
  const router = useRouter();

  const categoryId = router.query.category;

  const reportId = router.query.reportId;
  const reportRef = doc(db, "reports", reportId!);
  const report = useDocument(reportRef);

  const { data } = useSuspense(() => api.get(`/api/reports/${reportId}`), {
    key: `report/${reportId}`,
  });

  const stepIndex = router.query.step?.[0] ? parseInt(router.query.step[0]) : 0;
  const reportData =
    report.type === "user-flow"
      ? data?.report?.steps?.[stepIndex]?.lhr
      : data?.report;

  const step = report.summary?.[stepIndex];
  const gatherMode =
    step?.meta?.gatherMode === "snapshot" ? "Snapshot" : "Navigation";

  const title = report.type === "user-flow" ? step?.name : report.name;

  const subTitle =
    report.type === "user-flow"
      ? `${gatherMode} — ${report.name} ` +
        `(${stepIndex + 1} of ${data?.report?.steps?.length})`
      : report.url && report.url !== report.name
      ? report.url
      : null;

  return (
    <>
      <WrapTitle>
        <WrapHeading>
          <Heading level={1}>{title}</Heading>
          {subTitle && <P grey>{subTitle}</P>}
        </WrapHeading>
        <ReportActions stepIndex={stepIndex} data={report} />
      </WrapTitle>

      <Spacer h="1.2rem" />
      <ReportStatus data={report} />

      <Spacer h="1.2rem" />

      <ReportScores
        scores={
          report.type === "user-flow"
            ? report.summary?.[stepIndex]?.scores
            : report.summary
        }
      />
      <Spacer h="1.6rem" />

      <Suspense fallback={<Loader />}>
        <ReportDetails
          key={`${report.id}--${stepIndex}`}
          report={report}
          categoryId={categoryId}
          reportData={reportData}
          stepIndex={stepIndex}
        />
      </Suspense>
    </>
  );
}

export default function ReportDetailsPage() {
  return (
    <Auth>
      <AppLayout>
        <Suspense fallback={<Loader />}>
          <Content />
        </Suspense>
      </AppLayout>
    </Auth>
  );
}
