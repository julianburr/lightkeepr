import {
  ComponentType,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";
import styled from "styled-components";
import { Placement } from "@popperjs/core";

const Container = styled.div`
  background: #fff;
  color: #000;
  position: relative;
  filter: drop-shadow(0 0 1rem rgba(0, 0, 0, 0.25));
  border-radius: 0.3rem;
`;

const Arrow = styled.div`
  visibility: hidden;

  &:before {
    visibility: visible;
    content: " ";
    transform: rotate(45deg);
  }

  &,
  &:before {
    position: absolute;
    width: 0.6rem;
    height: 0.6rem;
    background: #fff;
  }

  [data-popper-placement^="top"] > & {
    bottom: -0.3rem;
  }

  [data-popper-placement^="bottom"] > & {
    top: -0.3rem;
  }

  [data-popper-placement^="left"] > & {
    right: -0.3rem;
  }

  [data-popper-placement^="right"] > & {
    left: -0.3rem;
  }
`;

type PassthroughProps = {
  ref: Ref<HTMLElement>;
  onMouseDown: (e: any) => void;
  onClick: (e: any) => void;
  onKeyDown: (e: any) => void;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
};

type PopoutProps = {
  Content: ComponentType<{
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    element?: HTMLElement | null;
    popper?: HTMLElement | null;
  }>;
  children: (props: PassthroughProps) => ReactNode;
  placement?: Placement;
  portalTarget?: HTMLElement;
};

export function Popout({
  Content,
  children,
  placement = "top",
  portalTarget,
}: PopoutProps) {
  const [visible, setVisible] = useState(false);

  // Initialise popper
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [popper, setPopper] = useState<HTMLElement | null>(null);
  const [arrow, setArrow] = useState<HTMLElement | null>(null);
  const { styles, attributes, update } = usePopper(element, popper, {
    placement,
    modifiers: [
      {
        name: "arrow",
        options: {
          element: arrow,
        },
      },
      {
        name: "offset",
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

  // NOTE: when clicking on an element, it will also trigger the `focus` event
  // which causes issues when toggling the visible state. To work around that we
  // also listen to the `mousedown`, which triggers before the `focus`, to
  // temporarily disable the `focus` handler
  const ignoreFocus = useRef(false);
  const handleMouseDown = useCallback(() => {
    ignoreFocus.current = true;
  }, []);

  const handleClick = useCallback(() => {
    handleToggle();
  }, []);

  const handleToggle = useCallback(() => {
    setVisible((state) => !state);
  }, []);

  const handleShow = useCallback(() => {
    setVisible(true);
  }, []);

  const handleHide = useCallback(() => {
    setVisible(false);
  }, []);

  const handleKeyDown = useCallback((e: any) => {
    switch (e.key) {
      case "Escape":
        handleHide();
        break;
      case "Space":
        handleToggle();
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }

    function handleOutsideClick(e: any) {
      if (!popper?.contains?.(e.target) && !element?.contains?.(e.target)) {
        handleHide();
      }
    }
    window.document.body.addEventListener("click", handleOutsideClick);
    return () =>
      window.document.body.removeEventListener("click", handleOutsideClick);
  }, [visible, popper, element]);

  useEffect(() => {
    function handleOutsideFocus(e: any) {
      if (!popper?.contains?.(e.target) && !element?.contains?.(e.target)) {
        return handleHide();
      }
      if (ignoreFocus.current) {
        ignoreFocus.current = false;
        return;
      }
      handleShow();
    }
    window.document.body.addEventListener("focus", handleOutsideFocus, true);
    return () =>
      window.document.body.removeEventListener(
        "focus",
        handleOutsideFocus,
        true
      );
  }, [popper, element]);

  return (
    <>
      {children({
        ref: setElement,
        onMouseDown: handleMouseDown,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        visible,
        setVisible,
      })}

      {visible &&
        createPortal(
          <Container
            ref={setPopper as any}
            style={styles.popper}
            {...attributes.popper}
          >
            <div>
              <Content
                visible={visible}
                setVisible={setVisible}
                element={element}
                popper={popper}
              />
            </div>
            <Arrow
              data-popper-arrow
              ref={setArrow as any}
              style={styles.arrow}
            />
          </Container>,
          portalTarget || element?.parentElement || window.document.body
        )}
    </>
  );
}
