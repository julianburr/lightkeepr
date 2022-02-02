import { ComponentProps, ReactNode, useCallback } from "react";

import { Button } from "src/components/button";
import { ButtonBar } from "src/components/button-bar";
import { Dialog } from "src/components/dialog";
import { P } from "src/components/text";
import { useDialog } from "src/hooks/use-dialog";

type ConfirmationDialogProps = {
  message: ReactNode;
  cancelLabel?: ReactNode;
  confirmLabel?: ReactNode;
  intent?: ComponentProps<typeof Button>["intent"];
  onConfirm?: () => any;
  onResponse?: (response: boolean) => any;
  onClose?: () => void;
};

export function ConfirmationDialog({
  message,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  intent = "primary",
  onConfirm,
  onResponse,
  onClose,
}: ConfirmationDialogProps) {
  return (
    <Dialog
      width="38rem"
      actions={
        <ButtonBar
          right={
            <>
              <Button
                intent="ghost"
                onClick={async () => {
                  await onResponse?.(false);
                  await onClose?.();
                }}
              >
                {cancelLabel}
              </Button>
              <Button
                intent={intent}
                autoFocus
                onClick={async () => {
                  await onResponse?.(true);
                  await onConfirm?.();
                  await onClose?.();
                }}
              >
                {confirmLabel}
              </Button>
            </>
          }
        />
      }
    >
      <P>{message}</P>
    </Dialog>
  );
}

export function useConfirmationDialog() {
  const dialog = useDialog(ConfirmationDialog);

  const open = useCallback(
    (args: Partial<ComponentProps<typeof ConfirmationDialog>>) => {
      return dialog.open(args);
    },
    []
  );

  return { ...dialog, open };
}
