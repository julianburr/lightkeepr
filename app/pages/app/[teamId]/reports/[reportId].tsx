import "src/utils/firebase";

import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import styled from "styled-components";

import { useCollection, useDocument } from "src/@packages/firebase";
import { Auth } from "src/components/auth";
import { Button } from "src/components/button";
import { Loader } from "src/components/loader";
import { ReportDetails } from "src/components/report/details";
import { ReportScores } from "src/components/report/scores";
import { Spacer } from "src/components/spacer";
import { SplitButton } from "src/components/split-button";
import { StatusAvatar } from "src/components/status-avatar";
import { Suspense } from "src/components/suspense";
import { GroupHeading, Heading, P, Small } from "src/components/text";
import { Tooltip } from "src/components/tooltip";
import { useConfirmationDialog } from "src/dialogs/confirm";
import { useAuthUser } from "src/hooks/use-auth-user";
import { useToast } from "src/hooks/use-toast";
import { AppLayout } from "src/layouts/app";
import { CATEGORIES } from "src/utils/audits";

import ChevronLeftSvg from "src/assets/icons/chevron-left.svg";
import ChevronRightSvg from "src/assets/icons/chevron-right.svg";

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

const WrapButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.4rem;
  padding: 0.3rem 0;
`;

const WrapStatus = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1.2rem;
`;

const StatusText = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  padding: 0.3rem 0;

  p {
    margin: 0;
  }
`;

function Content() {
  const authUser = useAuthUser();
  const router = useRouter();

  const toast = useToast();
  const confirmationDialog = useConfirmationDialog();

  const reportRef = doc(db, "reports", router.query.reportId!);
  const report = useDocument(reportRef, { fetch: router.isReady });

  const runRef = doc(db, "runs", report.run.id);
  const run = useDocument(runRef);

  const reports = useCollection(
    query(
      collection(db, "reports"),
      where("run", "==", runRef),
      orderBy("createdAt", "asc")
    ),
    { key: `${report.run.id}/reports` }
  );

  const projectRef = doc(db, "projects", run.project.id);
  const project = useDocument(projectRef);

  const currentIndex = reports.findIndex((r: any) => r.id === report.id);
  const prev = currentIndex === 0 ? undefined : reports[currentIndex - 1];
  const next =
    currentIndex >= reports.length - 1 ? undefined : reports[currentIndex + 1];

  const approvedBy = useDocument(
    report?.approvedBy?.id
      ? doc(db, "users", report?.approvedBy?.id)
      : undefined
  );

  const statusMessage =
    report.status === "passed"
      ? report.statusReasons?.includes?.("manual")
        ? `manually approved by ${approvedBy?.name} (${approvedBy?.email})`
        : null
      : report.statusReasons
          ?.map?.((reason: string) => {
            switch (reason) {
              case "target": {
                const categories = report.failedTargets
                  ?.map?.(
                    (key: string) => CATEGORIES.find((c) => c.id === key)?.label
                  )
                  ?.join(",");
                return `some targets were not met (${categories})`;
              }

              case "budget":
                return `some lighthouse budgets were not met`;

              case "regression:main":
                return `there were regressions compared to the main branch`;

              case "regression:branch":
                return `there were regressions compared to this feature branch`;
            }
          })
          ?.join(", ");

  return (
    <>
      <WrapTitle>
        <WrapHeading>
          <Heading level={1}>{report.name}</Heading>
          {report.url && report.url !== report.name && (
            <Small grey>{report.url}</Small>
          )}
        </WrapHeading>
        <WrapButtons>
          <SplitButton
            onClick={() =>
              confirmationDialog.open({
                message:
                  'Do you really want to approve this report. This will mark is as "passed", ' +
                  "even though it originally failed.",
                onConfirm: async () => {
                  await updateDoc(reportRef, {
                    status: "passed",
                    statusReasons: [...(report.statusReasons || []), "manual"],
                    approvedBy: doc(db, "users", authUser!.user!.id!),
                    approvedAt: new Date(),
                  });

                  // If all reports of the run are now `passed`, change the status of the run
                  // as well
                  const anyRemaining = reports.find(
                    (r: any) => r.id !== report.id && r.status !== "passed"
                  );
                  if (!anyRemaining) {
                    await updateDoc(runRef, {
                      status: "passed",
                      statusReasons: ["manual"],
                    });

                    if (project.lastRun?.id === run.id) {
                      // If this run is the latest of the current project, also update the project status
                      await updateDoc(projectRef, {
                        status: "passed",
                        statusReasons: ["manual"],
                      });
                    }
                  }

                  toast.show({ message: "Report has been manually approved" });
                },
              })
            }
            disabled={report.status !== "failed"}
            placement="bottom-end"
            items={[
              {
                label: "Delete report",
                onClick: () =>
                  confirmationDialog.open({
                    message:
                      "Are you sure you want to delete this report? This can not be reverted.",
                    confirmLabel: "Delete report",
                    intent: "danger",
                    onConfirm: async () => {
                      router.push(
                        `/app/${router.query.teamId}/runs/${report.run.id}`
                      );
                      await deleteDoc(reportRef);
                      toast.show({
                        message: "Report has been deleted successfully",
                      });
                    },
                  }),
                intent: "danger",
              },
            ]}
          >
            {report.status === "passed" ? "Report passed" : "Approve"}
          </SplitButton>

          <Spacer w=".8rem" />

          {prev ? (
            <Tooltip content={`Previous report: ${prev.name || prev.url}`}>
              {(props) => (
                <Button
                  {...props}
                  icon={<ChevronLeftSvg />}
                  href={`/app/${router.query.teamId}/reports/${prev.id}`}
                />
              )}
            </Tooltip>
          ) : (
            <Button icon={<ChevronLeftSvg />} disabled />
          )}

          {next ? (
            <Tooltip content={`Next report: ${next.name || next.url}`}>
              {(props) => (
                <Button
                  {...props}
                  icon={<ChevronRightSvg />}
                  href={`/app/${router.query.teamId}/reports/${next.id}`}
                />
              )}
            </Tooltip>
          ) : (
            <Button icon={<ChevronRightSvg />} disabled />
          )}
        </WrapButtons>
      </WrapTitle>

      <Spacer h="1.2rem" />
      <WrapStatus>
        <StatusAvatar
          status={report.status}
          statusReasons={report.statusReasons}
        />
        <StatusText>
          <GroupHeading>Status</GroupHeading>
          <P>
            {report.status === "failed" ? "Failed" : "Passed"}
            {statusMessage && <> — {statusMessage}</>}
          </P>
        </StatusText>
      </WrapStatus>

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
