import "src/utils/firebase";

import { doc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";
import styled from "styled-components";

import { useDocument } from "src/@packages/firebase";
import { Auth } from "src/components/auth";
import { Loader } from "src/components/loader";
import { ReportActions } from "src/components/report/actions";
import { ReportDetails } from "src/components/report/details";
import { ReportScores } from "src/components/report/scores";
import { ReportStatus } from "src/components/report/status";
import { Spacer } from "src/components/spacer";
import { Suspense } from "src/components/suspense";
import { Heading, Small } from "src/components/text";
import { AppLayout } from "src/layouts/app";

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

  const report = useDocument(doc(db, "reports", router.query.reportId!));

  return (
    <>
      <WrapTitle>
        <WrapHeading>
          <Heading level={1}>{report.name}</Heading>
          {report.url && report.url !== report.name && (
            <Small grey>{report.url}</Small>
          )}
        </WrapHeading>
        <ReportActions data={report} />
      </WrapTitle>

      <Spacer h="1.2rem" />
      <ReportStatus data={report} />

      <Spacer h="1.2rem" />

      <ReportScores scores={report.summary} />
      <Spacer h="1.6rem" />

      <Suspense fallback={<Loader />}>
        <ReportDetails
          reportId={router.query.reportId!}
          categoryId={router.query.category}
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
