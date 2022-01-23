import {
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  createContext,
} from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

import { Toast } from "src/components/toast";

function createTimer(callback: () => any, delay: number) {
  let timer: NodeJS.Timeout | null = null;
  let startTime: number | undefined;
  let remainingTime: number = delay;

  const pause = () => {
    window.clearTimeout(timer!);
    timer = null;
    remainingTime = Math.max(remainingTime - (Date.now() - startTime!), 2500);
  };

  const start = () => {
    if (timer) {
      return;
    }

    startTime = Date.now();
    timer = setTimeout(callback, remainingTime);
  };

  return {
    pause,
    start,
    resume: start,
  };
}

type ToastItem = {
  uuid: string;
  message: ReactNode;
  icon?: ReactNode;
  intend?: "primary" | "error" | "default";
  timer: {
    start: () => void;
    pause: () => void;
    resume: () => void;
  };
};

type ToastContextValue = {
  toasts?: ToastItem[];
  setToasts?: Dispatch<SetStateAction<ToastItem[]>>;
};

const ToastContext = createContext<ToastContextValue>({});

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.8rem;
  z-index: 200;
  gap: 0.4rem;
`;

export function ToastProvider(props: PropsWithChildren<Record<never, any>>) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const value = useMemo(() => ({ toasts, setToasts }), []);
  return (
    <>
      <ToastContext.Provider value={value} {...props} />
      {createPortal(
        <Container>
          {toasts.map((toast) => {
            const handlePause = () => toast.timer.pause();
            const handleResume = () => toast.timer.resume();
            return (
              <Toast
                key={toast.uuid}
                onMouseOver={handlePause}
                onMouseLeave={handleResume}
                onFocus={handlePause}
                onBlur={handleResume}
                {...toast}
              />
            );
          })}
        </Container>,
        window.document.body
      )}
    </>
  );
}

let uuid = 0;

export function useToast() {
  const { setToasts } = useContext(ToastContext);

  const show = useCallback(({ message, icon, intend = "default" }) => {
    const instanceUuid = `toast--${++uuid}`;

    // Create timer to remove toast after specific amount of time
    const timer = createTimer(() => {
      setToasts?.((toasts) => toasts.filter((t) => t.uuid !== instanceUuid));
    }, 6000);

    // Add toast
    const toast = { uuid: instanceUuid, message, icon, intend, timer };
    setToasts?.((toasts) => toasts.concat(toast));
    timer.start();

    return toast;
  }, []);

  return { show };
}
