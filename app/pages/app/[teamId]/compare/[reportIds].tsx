import "src/utils/firebase";

import { doc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";

import { useDocument } from "src/@packages/firebase";
import { Auth } from "src/components/auth";
import { List } from "src/components/list";
import { Loader } from "src/components/loader";
import { ReportCompareDetails } from "src/components/report/compare/details";
import { ReportScores } from "src/components/report/scores";
import { Spacer } from "src/components/spacer";
import { Suspense } from "src/components/suspense";
import { Heading } from "src/components/text";
import { AppLayout } from "src/layouts/app";
import { CompareReportListItem } from "src/list-items/report/compare";

const db = getFirestore();

function Content() {
  const router = useRouter();
  const [baseReportId, compareReportId] = router.query.reportIds!.split("..");

  const baseReport = useDocument(doc(db, "reports", baseReportId!));
  const compareReport = useDocument(doc(db, "reports", compareReportId!));

  return (
    <>
      <Heading level={1}>Compare reports</Heading>
      <Spacer h="1.6rem" />

      <List
        columns={2}
        gap="1.2rem"
        items={[baseReport, compareReport]}
        Item={CompareReportListItem}
      />
      <Spacer h="1.2rem" />

      <ReportScores scores={[baseReport.summary, compareReport.summary]} />

      <Spacer h="1.6rem" />

      <Suspense fallback={<Loader />}>
        <ReportCompareDetails
          reportIds={router.query.reportIds!}
          categoryId={router.query.category}
        />
      </Suspense>
    </>
  );
}

export default function CompareReports() {
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
