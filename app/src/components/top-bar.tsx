import "src/utils/firebase";

import classNames from "classnames";
import {
  useEffect,
  useRef,
  useState,
  Ref,
  ReactNode,
  ComponentProps,
} from "react";
import styled from "styled-components";

const Container = styled.header`
  width: 100%;
  padding: 0 2.4rem;
  height: 6.8rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  transition: box-shadow 0.2s;
  position: sticky;
  top: 0;
  z-index: 100;

  &.scrolled {
    background: #fff;
    box-shadow: 0 0.2rem 1.2rem rgba(0, 0, 0, 0.1);
  }
`;

const Inner = styled.div`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  & [data-mobile] {
    display: flex;

    @media (min-width: 800px) {
      display: none;
    }
  }

  & [data-tablet] {
    display: none;

    @media (min-width: 800px) {
      display: flex;
    }
  }
`;

type TopBarProps = ComponentProps<typeof Container> & {
  logo?: ReactNode;
  actions?: ReactNode;
};

export function TopBar({ logo, actions, className, props }: TopBarProps) {
  const containerRef = useRef<HTMLDivElement>();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    function handleScroll() {
      if (containerRef.current) {
        if (!scrolled && containerRef.current.offsetTop > 0) {
          setScrolled(true);
        } else if (scrolled && containerRef.current.offsetTop <= 0) {
          setScrolled(false);
        }
      }
    }
    window.document.addEventListener("scroll", handleScroll);
    return () => window.document.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <Container
      ref={containerRef as Ref<HTMLDivElement>}
      className={classNames(className, { scrolled })}
      {...props}
    >
      {logo}
      <Inner>{actions}</Inner>
    </Container>
  );
}
