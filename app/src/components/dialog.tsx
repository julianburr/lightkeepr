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

const Container = styled.div<{ width?: string }>`
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
`;

const TitleBar = styled.div<{ showShadow?: boolean; indicatorColor?: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1.8rem 3.2rem 1.4rem;
  background: #fff;
  position: sticky;
  top: 0;
  transition: box-shadow 0.2s;
  box-shadow: ${(props) =>
    props.showShadow
      ? "0 0.6rem 1.2rem rgba(0, 0, 0, 0.05)"
      : "0 0 0 rgba(0,0,0,0)"};

  &:before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1rem;
    background: ${(props) => props.indicatorColor};
    display: ${(props) => (props.indicatorColor ? "block" : "none")};
  }
`;

const Title = styled.h1`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  font-family: inherit;
  font-size: 2rem;
`;

const CloseButton = styled.button`
  border: 0 none;
  background: transparent;
  width: 3.2rem;
  height: 3.2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  svg {
    height: 1.8rem;
    width: auto;
  }
`;

const Content = styled.div<{ paddingBottom?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: ${(props) =>
    props.paddingBottom ? ".4rem 3.2rem 1.8rem" : ".4rem 3.2rem"};
  margin: -0.4rem 0 0;
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
  indicatorColor?: string;
}>;

export function Dialog({
  title,
  actions,
  children,
  width,
  onClose,
  indicatorColor,
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
            width={width}
            tabIndex={0}
            ref={dialogRef as Ref<HTMLDivElement>}
          >
            <TitleBar
              indicatorColor={indicatorColor}
              showShadow={
                scroll?.current !== undefined ? scroll.current > 0 : undefined
              }
            >
              <Title>{title}</Title>
              <CloseButton onClick={handleClose}>
                <CrossSvg />
              </CloseButton>
            </TitleBar>

            <Content paddingBottom={!actions}>{children}</Content>

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
  title?: ReactNode;
  message: ReactNode;
  stack?: any;
  onClose?: () => void;
};

export function ErrorDialog({
  title,
  message,
  stack,
  onClose,
}: ErrorDialogProps) {
  return (
    <Dialog
      indicatorColor="#f5737f"
      title={title || "Something went wrong"}
      width="35rem"
      actions={<ButtonBar right={<Button onClick={onClose}>Got it</Button>} />}
    >
      <P>{message}</P>
    </Dialog>
  );
}
