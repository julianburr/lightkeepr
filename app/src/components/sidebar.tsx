import { useRef, ReactNode, useEffect, RefObject, Ref, useState } from "react";
import styled from "styled-components";

import { useSidebarState } from "src/hooks/use-sidebar-state";

const Container = styled.div`
  height: 100%;
  flex-shrink: 0;
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: rgba(0, 0, 0, 0);
  pointer-events: none;
  transition: background 0.2s, backdrop-filter 0.2s;

  &[data-active="true"] {
    opacity: 1;
    pointer-events: all;
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(0.2rem);
  }

  @media (min-width: 800px) {
    &,
    &[data-active="true"] {
      z-index: 2;
      position: relative;
      width: 26rem;
      background: transparent;
      pointer-events: all;
      backdrop-filter: none;
    }
  }
`;

const Menu = styled.menu`
  height: 100%;
  width: calc(100% - 2.4rem);
  max-width: 28rem;
  background: #fff;
  transform: translateX(100%);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: auto;

  [data-active="true"] > & {
    box-shadow: 0 0 1.8rem rgba(0, 0, 0, 0.1);
    transform: translateX(0);
  }

  @media (min-width: 800px) {
    && {
      max-height: calc(100% - 6.8rem);
      position: fixed;
      z-index: 10;
      top: 6.8rem;
      left: 0;
      bottom: 0;
      transform: translateX(0);
      box-shadow: none;
      width: 100%;
      transition: none;
    }
  }
`;

const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.6rem 2.4rem;
  background: var(--sol--palette-sand-100);
  position: sticky;
  top: 0;
  z-index: 20;

  @media (min-width: 800px) {
    display: none;
  }
`;

const WrapContent = styled.div`
  padding: var(--sol--spacing-xl);
`;

type PassthroughProps = {
  active: boolean;
  isMobile: boolean;
  menuRef: RefObject<HTMLMenuElement | undefined>;
};

type RenderFn = ({ active, isMobile, menuRef }: PassthroughProps) => ReactNode;

type SidebarProps = {
  top?: ReactNode;
  children: ReactNode | RenderFn;
};

export function Sidebar({ top, children }: SidebarProps) {
  const { menuRef, backdropRef, active } = useSidebarState();

  // HACK: this is a pretty convoluted way to allow the user to go through
  // the menu structure without navigating until they hit a final link,
  // but we only want this behaviour on mobile :/
  const topContainerRef = useRef<HTMLDivElement>();
  const [isMobile, setMobile] = useState(false);
  useEffect(() => {
    function handleResize() {
      setMobile(!!topContainerRef?.current?.clientHeight);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Container ref={backdropRef as Ref<HTMLDivElement>} data-active={active}>
      <Menu ref={menuRef as Ref<HTMLMenuElement>}>
        {top && (
          <TopContainer ref={topContainerRef as Ref<HTMLDivElement>}>
            {top}
          </TopContainer>
        )}
        <WrapContent>
          {typeof children === "function"
            ? children({ active, isMobile, menuRef })
            : children}
        </WrapContent>
      </Menu>
    </Container>
  );
}
