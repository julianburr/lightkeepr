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
