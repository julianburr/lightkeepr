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

import { useCollection, useDocument } from "src/@packages/firebase";
import { ActionMenu } from "src/components/action-menu";
import { Auth } from "src/components/auth";
import { ActionButton } from "src/components/button";
import { ButtonBar } from "src/components/button-bar";
import { List } from "src/components/list";
import { Loader } from "src/components/loader";
import { Spacer } from "src/components/spacer";
import { Suspense } from "src/components/suspense";
import { Heading } from "src/components/text";
import { useConfirmationDialog } from "src/dialogs/confirm";
import { useToast } from "src/hooks/use-toast";
import { AppLayout } from "src/layouts/app";
import { ReportListItem } from "src/list-items/report";

const db = getFirestore();

function Content() {
  const router = useRouter();

  const toast = useToast();
  const confirmationDialog = useConfirmationDialog();

  const runRef = doc(db, "runs", router.query.runId!);
  const run = useDocument(runRef);

  const reports = useCollection(
    query(
      collection(db, "reports"),
      where("run", "==", runRef),
      orderBy("createdAt", "asc")
    ),
    { key: `${router.query.runId}/reports` }
  );

  return (
    <>
      <ButtonBar
        left={
          <Heading level={1}>
            {run.commitMessage || run.commitHash || run.id}
          </Heading>
        }
        right={
          <ActionMenu
            placement="bottom-end"
            items={[
              ...(run.status === "running"
                ? [
                    {
                      label: "Cancel run",
                      onClick: () =>
                        confirmationDialog.open({
                          message: "Are you sure you want to cancel this run?",
                          onConfirm: async () => {
                            await updateDoc(runRef, {
                              status: "cancelled",
                              finishedAt: new Date(),
                            });
                            toast.show({
                              message: "Run has been cancelled successfully",
                            });
                          },
                        }),
                    },
                  ]
                : []),
              {
                label: "Delete run",
                onClick: () =>
                  confirmationDialog.open({
                    message:
                      "Are you sure you want to delete this run? It will also delete all the " +
                      "reports within it. This can not be reverted.",
                    confirmLabel: "Delete run",
                    intent: "danger",
                    onConfirm: async () => {
                      router.push(
                        `/app/${router.query.teamId}/projects/${run.project.id}`
                      );
                      await deleteDoc(runRef);
                      toast.show({
                        message: "Run has been deleted successfully",
                      });
                    },
                  }),
                intent: "danger",
              },
            ]}
          >
            {(props) => <ActionButton intent="secondary" {...props} />}
          </ActionMenu>
        }
      />
      <Spacer h="2.4rem" />

      <Heading level={2}>Reports</Heading>
      <Spacer h=".8rem" />

      {/* TODO: filters */}
      <List items={reports} Item={ReportListItem} />
    </>
  );
}

export default function RunDetails() {
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
