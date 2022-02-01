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
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import classNames from "classnames";

import { useCollection, useDocument } from "src/@packages/firebase";
import { CATEGORIES } from "src/utils/audits";
import { useAuthUser } from "src/hooks/use-auth-user";
import { useToast } from "src/hooks/use-toast";
import { useConfirmationDialog } from "src/hooks/use-dialog";
import { AppLayout } from "src/layouts/app";
import { Auth } from "src/components/auth";
import { GroupHeading, Heading, P, Small } from "src/components/text";
import { Spacer } from "src/components/spacer";
import { Loader } from "src/components/loader";
import { ReportDetails } from "src/components/report-details";
import { Suspense } from "src/components/suspense";
import { Button } from "src/components/button";
import { SplitButton } from "src/components/split-button";
import { Tooltip } from "src/components/tooltip";
import { StatusAvatar } from "src/components/status-avatar";

import ChevronLeftSvg from "src/assets/icons/chevron-left.svg";
import ChevronRightSvg from "src/assets/icons/chevron-right.svg";

const db = getFirestore();

const WrapSummary = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.4rem 1.2rem;
  font-family: "Playfair Display";
  text-align: center;
  margin: 1.2rem 0;
  padding: 1.2rem 0 1.6rem;
  background: #fff;
  z-index: 10;

  a {
    color: inherit;

    &:hover,
    &:focus {
      color: inherit;
      text-decoration: none;
    }
  }
`;

const SummaryItem = styled.div<{ value: number; hasRun?: boolean }>`
  width: 8rem;
  height: 8rem;
  border: 0 none;
  border-radius: var(--sol--border-radius-s);
  transition: background 0.2s;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  line-height: 1;
  background: ${(props) =>
    !props.hasRun
      ? `var(--sol--palette-sand-100)`
      : props.value < 50
      ? `var(--sol--palette-red-50)`
      : props.value < 90
      ? `var(--sol--palette-yellow-50)`
      : `var(--sol--palette-green-50)`};

  @media (min-width: 800px) {
    width: 11rem;
    height: 11rem;
    border: 0 none;
  }

  &:hover,
  &:focus {
    background: ${(props) =>
      !props.hasRun
        ? `var(--sol--palette-sand-200)`
        : props.value < 50
        ? `var(--sol--palette-red-100)`
        : props.value < 90
        ? `var(--sol--palette-yellow-100)`
        : `var(--sol--palette-green-100)`};
  }

  &.active:hover,
  &.active:focus,
  &.active {
    background: ${(props) =>
      !props.hasRun
        ? `var(--sol--palette-sand-400)`
        : props.value < 50
        ? `var(--sol--palette-red-200)`
        : props.value < 90
        ? `var(--sol--palette-yellow-200)`
        : `var(--sol--palette-green-200)`};
  }

  &:before,
  &:after,
  & span:before,
  & span:after {
    content: " ";
    position: absolute;
    color: ${(props) =>
      !props.hasRun
        ? `var(--sol--palette-sand-500)`
        : props.value < 50
        ? `var(--sol--palette-red-500)`
        : props.value < 90
        ? `var(--sol--palette-yellow-500)`
        : `var(--sol--palette-green-500)`};
    border-width: 0.4rem;
    border-style: none;
    pointer-events: none;

    @media (min-width: 800px) {
      border-width: 0.6rem;
    }
  }

  &:before {
    top: 0;
    left: 50%;
    right: ${(props) => `${50 - (Math.min(props.value, 12.5) / 12.5) * 50}%;`};
    bottom: ${(props) =>
      `${(Math.min(Math.max(props.value - 12.5, 0), 12.5) / 12.5) * 50}%`};
    border-top-style: ${(props) => (props.value <= 0 ? "none" : "solid")};
    border-right-style: ${(props) => (props.value <= 12.5 ? "none" : "solid")};
    border-top-right-radius: ${(props) =>
      props.value <= 12.5 ? "0" : "var(--sol--border-radius-s)"};
  }

  &:after {
    top: 50%;
    right: 0;
    bottom: ${(props) =>
      `${50 - (Math.min(Math.max(props.value - 25, 0), 12.5) / 12.5) * 50}%;`};
    left: auto;
    width: ${(props) =>
      `${(Math.min(Math.max(props.value - 37.5, 0), 12.5) / 12.5) * 50}%`};
    border-right-style: ${(props) => (props.value <= 25 ? "none" : "solid")};
    border-bottom-style: ${(props) => (props.value <= 37.5 ? "none" : "solid")};
    border-bottom-right-radius: ${(props) =>
      props.value <= 37.5 ? "0" : "var(--sol--border-radius-s)"};
  }

  & span:before {
    bottom: 0;
    right: 50%;
    left: ${(props) =>
      `${50 - (Math.min(Math.max(props.value - 50, 0), 12.5) / 12.5) * 50}%;`};
    top: auto;
    height: ${(props) =>
      `${(Math.min(Math.max(props.value - 62.5, 0), 12.5) / 12.5) * 50}%`};
    border-bottom-style: ${(props) => (props.value <= 50 ? "none" : "solid")};
    border-left-style: ${(props) => (props.value <= 62.5 ? "none" : "solid")};
    border-bottom-left-radius: ${(props) =>
      props.value <= 62.5 ? "0" : "var(--sol--border-radius-s)"};
  }

  & span:after {
    bottom: 50%;
    left: 0;
    top: ${(props) =>
      `${50 - (Math.min(Math.max(props.value - 75, 0), 12.5) / 12.5) * 50}%;`};
    right: auto;
    width: ${(props) =>
      `${(Math.min(Math.max(props.value - 87.5, 0), 12.5) / 12.5) * 50}%`};
    border-left-style: ${(props) => (props.value <= 75 ? "none" : "solid")};
    border-top-style: ${(props) => (props.value <= 87.5 ? "none" : "solid")};
    border-top-left-radius: ${(props) =>
      props.value <= 87.5 ? "0" : "var(--sol--border-radius-s)"};
  }
`;

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

const Label = styled.label`
  font-size: 1rem;
  font-weight: 400;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.6);
`;

const Score = styled.span`
  font-size: 3.6rem;
  margin-top: -0.8rem;

  @media (min-width: 800px) {
    font-size: 4.2rem;
  }
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

  console.log({ report });

  const statusMessage =
    report.status === "passed"
      ? report.statusReasons?.includes?.("manual")
        ? `manually approved by ${report?.approvedBy.id}`
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

          <Spacer w=".8rem" />

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

      <WrapSummary>
        {CATEGORIES.map((item) => {
          const { category, ...q } = router.query;

          const hasRun =
            report.summary?.[item.id] || report.summary?.[item.id] === 0;
          const score = hasRun
            ? Math.round(report.summary?.[item.id] * 100)
            : 0;

          return (
            <Link
              key={item.id}
              href={{
                query: {
                  ...q,
                  ...(category === item.id ? {} : { category: item.id }),
                },
              }}
            >
              <a>
                <Label>{item.label}</Label>
                <SummaryItem
                  hasRun={hasRun}
                  value={score}
                  className={classNames({
                    active: router.query.category === item.id,
                  })}
                >
                  <Score>{hasRun ? score : "n/a"}</Score>
                </SummaryItem>
              </a>
            </Link>
          );
        })}
      </WrapSummary>
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
