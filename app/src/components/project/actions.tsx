import "src/utils/firebase";

import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { ActionMenu } from "src/components/action-menu";
import { ActionButton } from "src/components/button";
import { useConfirmationDialog } from "src/dialogs/confirm";
import { useAuthUser } from "src/hooks/use-auth-user";
import { useToast } from "src/hooks/use-toast";

const db = getFirestore();

export function ProjectActions({ data }: any) {
  const router = useRouter();
  const authUser = useAuthUser();

  const toast = useToast();
  const confirmationDialog = useConfirmationDialog();

  const projectRef = doc(db, "projects", data.id);

  const subscribe = useCallback(() => {
    updateDoc(doc(db, "users", authUser.uid!), {
      subscriptions: [...(authUser.user?.subscriptions || []), projectRef],
    })
      .then(() => {
        toast.show({ message: "Subscribed successfully" });
      })
      .catch((e) => {
        console.error(e);
        toast.show({ message: "Subscription failed" });
      });
  }, [data.id, authUser.user?.subscriptions]);

  const unsubscribe = useCallback(() => {
    updateDoc(doc(db, "users", authUser.uid!), {
      subscriptions:
        authUser.user?.subscriptions?.filter((ref) => ref.id !== data.id) || [],
    })
      .then(() => {
        toast.show({ message: "Un-subscribed successfully" });
      })
      .catch((e) => {
        console.error(e);
        toast.show({ message: "Un-subscription failed" });
      });
  }, [data.id, authUser.user?.subscriptions]);

  const deleteProject = useCallback(() => {
    confirmationDialog.open({
      message:
        "Are you sure you want to delete this project and all its runs and reports with it? " +
        "This cannot be reverted.",
      confirmLabel: "Delete project",
      intent: "danger",
      onConfirm: async () => {
        router.push(`/app/${router.query.teamId}`);
        await deleteDoc(projectRef);
        toast.show({ message: "Project deleted successfully" });
      },
    });
  }, [data.id]);

  return (
    <ActionMenu
      placement="bottom-end"
      items={[
        authUser.user?.subscriptions?.find((ref) => ref.id === data.id)
          ? {
              label: "Un-subscribe",
              onClick: unsubscribe,
            }
          : {
              label: "Subscribe",
              description:
                "Get notifications whenever any report in this project fails.",
              onClick: subscribe,
            },
        {
          items: [
            {
              label: "Delete project",
              intent: "danger",
              onClick: deleteProject,
            },
          ],
        },
      ]}
    >
      {(props) => <ActionButton intent="secondary" {...props} />}
    </ActionMenu>
  );
}
