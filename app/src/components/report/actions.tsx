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
import { useCallback, useMemo } from "react";
import styled from "styled-components";

import { useCollection, useDocument } from "src/@packages/firebase";
import { Button } from "src/components/button";
import { Spacer } from "src/components/spacer";
import { SplitButton } from "src/components/split-button";
import { Tooltip } from "src/components/tooltip";
import { useConfirmationDialog } from "src/dialogs/confirm";
import { useAuthUser } from "src/hooks/use-auth-user";
import { useToast } from "src/hooks/use-toast";

import ChevronLeftSvg from "src/assets/icons/outline/chevron-left.svg";
import ChevronRightSvg from "src/assets/icons/outline/chevron-right.svg";

import { CommentsButton } from "../comments-button";

const db = getFirestore();

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.4rem;
  padding: 0.3rem 0;
`;

type ReportActionsProps = {
  data: any;
  stepIndex?: number;
};

export function ReportActions({ data, stepIndex }: ReportActionsProps) {
  const router = useRouter();
  const authUser = useAuthUser();

  const toast = useToast();
  const confirmationDialog = useConfirmationDialog();

  const reportRef = doc(db, "reports", data.id);

  const runRef = doc(db, "runs", data.run.id);
  const run = useDocument(runRef);

  const reports = useCollection(
    query(
      collection(db, "reports"),
      where("run", "==", runRef),
      orderBy("createdAt", "asc")
    ),
    { key: `${data.run.id}/reports` }
  );

  const projectRef = doc(db, "projects", run.project.id);
  const project = useDocument(projectRef);

  // Setup for comments
  const commentsFilters = useMemo(
    () => [where("report", "==", reportRef), where("audit", "==", null)],
    [reportRef]
  );

  const relatedCommentsFilters = useMemo(
    () => [
      where("report", "!=", reportRef),
      where("audit", "==", null),
      where("team", "==", doc(db, "teams", data.team.id)),
      where("reportName", "==", data.name),
      orderBy("report", "asc"),
    ],
    [reportRef, data.team.id, data.name]
  );

  const mapComment = useCallback(
    (comment) => ({
      ...comment,
      type: "run",
      record: reportRef,
      project: doc(db, "projects", data.project.id),
      run: doc(db, "runs", data.run.id),
      report: reportRef,
      reportName: data.name,
    }),
    [reportRef]
  );

  // Put together all reports (including individual steps for user flows)
  // for the pagination actions
  const pages = reports.reduce((all: any[], report: any) => {
    if (report.type === "user-flow") {
      report.summary?.forEach?.((_: any, index: number) => {
        const name = report.summary?.[index]?.name;
        const href = `/app/${authUser.team?.id}/reports/${report.id}/${index}`;
        const isCurrent = report.id === data.id && index === stepIndex;
        all.push({ name, href, isCurrent });
      });
    } else {
      const name = report.name;
      const href = `/app/${authUser.team?.id}/reports/${report.id}`;
      const isCurrent = report.id === data.id;
      all.push({ name, href, isCurrent });
    }
    return all;
  }, []);

  const currentIndex = pages.findIndex((p: any) => p.isCurrent);
  const prev = currentIndex === 0 ? undefined : pages[currentIndex - 1];
  const next =
    currentIndex >= pages.length - 1 ? undefined : pages[currentIndex + 1];

  // Put together actions
  const approveReport = useCallback(() => {
    confirmationDialog.open({
      message:
        'Do you really want to approve this report. This will mark is as "passed", ' +
        "even though it originally failed.",
      onConfirm: async () => {
        await updateDoc(reportRef, {
          status: {
            value: "passed",
            reasons: [...(data.status?.reasons || []), "manual"],
          },
          approvedBy: doc(db, "users", authUser!.user!.id!),
          approvedAt: new Date(),
        });

        // If all reports of the run are now `passed`, change the status of the run
        // as well
        const anyRemaining = reports.find(
          (r: any) => r.id !== data.id && r.status?.value !== "passed"
        );
        if (!anyRemaining) {
          await updateDoc(runRef, {
            status: {
              value: "passed",
              reasons: ["manual"],
            },
          });

          if (
            project.lastRun?.id === run.id &&
            project.gitMain === run.branch
          ) {
            // If this run is the latest of the current project, also update the project status
            await updateDoc(projectRef, {
              status: {
                value: "passed",
                reasons: ["manual"],
              },
            });
          }
        }

        toast.show({ message: "Report has been manually approved" });
      },
    });
  }, [data.id]);

  const deleteReport = useCallback(() => {
    confirmationDialog.open({
      message:
        "Are you sure you want to delete this report? This can not be reverted.",
      confirmLabel: "Delete report",
      intent: "danger",
      onConfirm: async () => {
        router.push(`/app/${router.query.teamId}/runs/${data.run.id}`);
        await deleteDoc(reportRef);
        toast.show({
          message: "Report has been deleted successfully",
        });
      },
    });
  }, [data.id]);

  return (
    <Container>
      <CommentsButton
        id={`report/${data.id}`}
        filters={commentsFilters}
        relatedFilters={relatedCommentsFilters}
        mapComment={mapComment}
      />

      <SplitButton
        onClick={approveReport}
        disabled={data.status?.value !== "failed"}
        placement="bottom-end"
        items={[
          {
            label: "Delete report",
            onClick: deleteReport,
            intent: "danger",
          },
        ]}
      >
        {data.status?.value === "passed" ? "Report passed" : "Approve"}
      </SplitButton>

      <Spacer w=".8rem" />

      {prev ? (
        <Tooltip content={`Previous report: ${prev.name}`}>
          {(props) => (
            <Button {...props} icon={<ChevronLeftSvg />} href={prev.href} />
          )}
        </Tooltip>
      ) : (
        <Button icon={<ChevronLeftSvg />} disabled />
      )}

      {next ? (
        <Tooltip content={`Next report: ${next.name}`}>
          {(props) => (
            <Button {...props} icon={<ChevronRightSvg />} href={next.href} />
          )}
        </Tooltip>
      ) : (
        <Button icon={<ChevronRightSvg />} disabled />
      )}
    </Container>
  );
}
