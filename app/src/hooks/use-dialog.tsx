import { ComponentType, Dispatch, useCallback } from "react";
import { PropsWithChildren } from "react";
import { SetStateAction } from "react";
import { useContext } from "react";
import { createContext, useEffect, useState } from "react";

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
      {dialogs.map(({ id, close, Dialog }: any) => {
        return (
          <DialogMetaContext.Provider key={id} value={{ id, close }}>
            <Dialog id={id} onClose={close} />
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
  console.log({ dialogs, setDialogs });

  const open = useCallback(() => {
    console.log("open called", { setDialogs, id: instanceUuid, Dialog, close });
    setDialogs?.((dialogs) =>
      dialogs.concat([{ id: instanceUuid, Dialog, close }])
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
