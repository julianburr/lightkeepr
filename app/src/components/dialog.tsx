import styled from "styled-components";
import { createFocusTrap } from "focus-trap";

import CrossSvg from "src/assets/icons/x.svg";
import {
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { Ref } from "react";
import { DialogMetaContext } from "src/hooks/use-dialog";
import { useState } from "react";
import { P } from "./text";
import { Button } from "./button";
import { ButtonBar } from "./button-bar";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 400;
  backdrop-filter: blur(0.2rem);
  padding: 2.4rem;
`;

const Container = styled.div<{ width?: string; intent?: "error" | "warning" }>`
  background: #fff;
  width: 100%;
  max-width: ${(props) => props.width || "60rem"};
  border-radius: 0.8rem;
  margin: 0 auto;
  padding: 0;
  box-shadow: 0 0.2rem 2rem rgba(0, 0, 0, 0.1);
  max-height: 100%;
  overflow: auto;
  position: relative;
  outline-offset: 0.2rem;

  &:before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 1.2rem;
    background: ${(props) =>
      `var(--sol--container-${props.intent}-background)`};
    z-index: 20;
  }
`;

const TitleBar = styled.div<{ showShadow?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 1.8rem 3.2rem 1.4rem;
  background: #fff;
  position: sticky;
  top: 0;
  transition: box-shadow 0.2s;
  box-shadow: ${(props) =>
    props.showShadow
      ? "0 0.6rem 1.2rem rgba(0, 0, 0, 0.05)"
      : "0 0 0 rgba(0,0,0,0)"};
`;

const Title = styled.h1`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  font-size: 2.2rem;
  line-height: 1.2;
  font-family: "Playfair Display";
`;

const CloseButton = styled.button`
  border: 0 none;
  background: transparent;
  width: 3.6rem;
  height: 3.6rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0.4rem -0.8rem 0 1.6rem;

  svg {
    height: 1.8rem;
    width: auto;
  }
`;

const Content = styled.div<{ paddingBottom?: boolean; paddingTop?: boolean }>`
  display: flex;
  flex-direction: column;
  padding-left: 3.2rem;
  padding-right: 3.2rem;
  padding-top: ${(props) => (props.paddingTop ? "2.8rem" : ".4rem")};
  padding-bottom: ${(props) => (props.paddingBottom ? "2.8rem" : ".4rem")};
  margin: -0.4rem 0 0;

  p {
    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Footer = styled.div<{ showShadow?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1.8rem 3.2rem;
  position: sticky;
  bottom: 0;
  background: #fff;
  transition: box-shadow 0.2s;
  box-shadow: ${(props) =>
    props.showShadow
      ? "0 -0.6rem 1.2rem rgba(0, 0, 0, 0.05)"
      : "0 0 0 rgba(0,0,0,0)"};
`;

export type DialogPassthroughProps = {
  id: string;
  onClose: () => void;
};

type DialogProps = PropsWithChildren<{
  icon?: ReactNode;
  title?: ReactNode;
  actions?: ReactNode;
  width?: string;
  onClose?: () => void;
  intent?: "error" | "warning";
}>;

export function Dialog({
  title,
  actions,
  children,
  width,
  onClose,
  intent,
}: DialogProps) {
  const dialogMeta = useContext(DialogMetaContext);

  const handleClose = onClose || dialogMeta?.close;

  // Trap focus within this dialog
  const backdropRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (backdropRef.current) {
      const trap = createFocusTrap(backdropRef.current);
      trap.activate();
      return () => {
        trap.deactivate();
      };
    }
  }, []);

  // Disable body scroll
  useEffect(() => {
    window.document.body.style.overflow = "hidden";
    return () => {
      window.document.body.style.overflow = "auto";
    };
  }, []);

  // Dialog should close when user presses `esc`
  useEffect(() => {
    function handleKeyDown(e: any) {
      if (e.key === "Escape") {
        handleClose?.();
      }
    }
    window.document.body.addEventListener("keydown", handleKeyDown);
    return () =>
      window.document.body.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Keep track of scroll position, so we can show shadows based in it on the
  // header and footer of the dialog
  const dialogRef = useRef<HTMLDivElement>();
  const [scroll, setScroll] = useState<{ current?: number; max?: number }>({});
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    function handleScroll() {
      if (dialogRef.current) {
        setScroll({
          current: dialogRef.current.scrollTop,
          max: dialogRef.current.scrollHeight - dialogRef.current.clientHeight,
        });
      }
    }

    handleScroll();

    dialog.addEventListener("scroll", handleScroll);
    return () => dialog.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {createPortal(
        <Backdrop data-tether-target ref={backdropRef as Ref<HTMLDivElement>}>
          <Container
            intent={intent}
            width={width}
            tabIndex={0}
            ref={dialogRef as Ref<HTMLDivElement>}
          >
            {title && (
              <TitleBar
                showShadow={
                  scroll?.current !== undefined ? scroll.current > 0 : undefined
                }
              >
                <Title>{title}</Title>
                <CloseButton onClick={handleClose}>
                  <CrossSvg />
                </CloseButton>
              </TitleBar>
            )}

            <Content paddingTop={!title} paddingBottom={!actions}>
              {children}
            </Content>

            {actions && (
              <Footer
                showShadow={
                  scroll?.max !== undefined && scroll?.current !== undefined
                    ? scroll.max > 0 && scroll.current < scroll.max
                    : undefined
                }
              >
                {actions}
              </Footer>
            )}
          </Container>
        </Backdrop>,
        window.document.body
      )}
    </>
  );
}

type ErrorDialogProps = {
  message: ReactNode;
  stack?: any;
  onClose?: () => void;
};

export function ErrorDialog({ message, stack, onClose }: ErrorDialogProps) {
  return (
    <Dialog
      intent="error"
      width="35rem"
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

type ConfirmationDialogProps = {
  message: ReactNode;
  cancelLabel?: ReactNode;
  confirmLabel?: ReactNode;
  onConfirm?: () => any;
  onResponse?: (response: boolean) => any;
  onClose?: () => void;
};

export function ConfirmationDialog({
  message,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  onConfirm,
  onResponse,
  onClose,
}: ConfirmationDialogProps) {
  return (
    <Dialog
      width="35rem"
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
                intent="primary"
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
