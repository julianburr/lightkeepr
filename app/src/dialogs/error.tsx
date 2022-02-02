import { ComponentProps, useCallback } from "react";
import { ReactNode } from "react";

import { Button } from "src/components/button";
import { ButtonBar } from "src/components/button-bar";
import { Dialog } from "src/components/dialog";
import { P } from "src/components/text";
import { useDialog } from "src/hooks/use-dialog";

type ErrorDialogProps = {
  message: ReactNode;
  stack?: any;
  onClose?: () => void;
};

export function ErrorDialog({ message, stack, onClose }: ErrorDialogProps) {
  return (
    <Dialog
      intent="error"
      width="38rem"
      actions={
        <ButtonBar
          right={
            <Button intent="ghost" onClick={onClose}>
              Got it
            </Button>
          }
        />
      }
    >
      <P>{message}</P>
    </Dialog>
  );
}

export function useErrorDialog() {
  const dialog = useDialog(ErrorDialog);

  const open = useCallback(
    (e: Error | Partial<ComponentProps<typeof ErrorDialog>>) => {
      return dialog.open({
        message: e.message,
        stack: "stack" in e ? e.stack : undefined,
      });
    },
    []
  );

  return { ...dialog, open };
}
