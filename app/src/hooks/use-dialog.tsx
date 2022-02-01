import { ComponentProps } from "react";
import {
  ComponentType,
  Dispatch,
  useCallback,
  createContext,
  useState,
  useContext,
  SetStateAction,
  PropsWithChildren,
} from "react";

import { ConfirmationDialog, ErrorDialog } from "src/components/dialog";

export const DialogMetaContext = createContext<{
  id?: string;
  open?: () => void;
  close?: () => void;
}>({});

const DialogContext = createContext<{
  dialogs: any[];
  setDialogs?: Dispatch<SetStateAction<any[]>>;
}>({ dialogs: [] });

export function DialogProvider(props: PropsWithChildren<Record<never, any>>) {
  const [dialogs, setDialogs] = useState<any[]>([]);
  return (
    <>
      <DialogContext.Provider value={{ dialogs, setDialogs }} {...props} />
      {dialogs.map(({ id, close, Dialog, props: dialogProps }: any) => {
        return (
          <DialogMetaContext.Provider key={id} value={{ id, close }}>
            <Dialog {...dialogProps} id={id} onClose={close} />
          </DialogMetaContext.Provider>
        );
      })}
    </>
  );
}

let uuid = 0;

export function useDialog(Dialog: ComponentType<any>) {
  const [instanceUuid] = useState(++uuid);

  const { dialogs, setDialogs } = useContext(DialogContext);

  const open = useCallback((props?: any) => {
    setDialogs?.((dialogs) =>
      dialogs.concat([{ id: instanceUuid, Dialog, close, props }])
    );
  }, []);

  const close = useCallback(
    () =>
      setDialogs?.((dialogs) =>
        dialogs.filter((d: any) => d.id !== instanceUuid)
      ),
    []
  );

  return { open, close, isOpen: dialogs.find((d) => d.id === instanceUuid) };
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
