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
import { useCallback } from "react";
import styled from "styled-components";

import { useCollection, useDocument } from "src/@packages/firebase";
import { Button } from "src/components/button";
import { Spacer } from "src/components/spacer";
import { SplitButton } from "src/components/split-button";
import { Tooltip } from "src/components/tooltip";
import { useConfirmationDialog } from "src/dialogs/confirm";
import { useAuthUser } from "src/hooks/use-auth-user";
import { useToast } from "src/hooks/use-toast";

import ChevronLeftSvg from "src/assets/icons/chevron-left.svg";
import ChevronRightSvg from "src/assets/icons/chevron-right.svg";

const db = getFirestore();

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.4rem;
  padding: 0.3rem 0;
`;

export function ReportActions({ data }: any) {
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

  const currentIndex = reports.findIndex((r: any) => r.id === data.id);
  const prev = currentIndex === 0 ? undefined : reports[currentIndex - 1];
  const next =
    currentIndex >= reports.length - 1 ? undefined : reports[currentIndex + 1];

  const approveReport = useCallback(() => {
    confirmationDialog.open({
      message:
        'Do you really want to approve this report. This will mark is as "passed", ' +
        "even though it originally failed.",
      onConfirm: async () => {
        await updateDoc(reportRef, {
          status: "passed",
          statusReasons: [...(data.statusReasons || []), "manual"],
          approvedBy: doc(db, "users", authUser!.user!.id!),
          approvedAt: new Date(),
        });

        // If all reports of the run are now `passed`, change the status of the run
        // as well
        const anyRemaining = reports.find(
          (r: any) => r.id !== data.id && r.status !== "passed"
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
      <SplitButton
        onClick={approveReport}
        disabled={data.status !== "failed"}
        placement="bottom-end"
        items={[
          {
            label: "Delete report",
            onClick: deleteReport,
            intent: "danger",
          },
        ]}
      >
        {data.status === "passed" ? "Report passed" : "Approve"}
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
    </Container>
  );
}
