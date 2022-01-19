import styled from "styled-components";

import LogoSvg from "src/assets/logo.svg";
import { getAuth } from "firebase/auth";
import { Button } from "./button";
import { useEffect, useRef, useState } from "react";
import { Ref } from "react";

const Container = styled.div<{ scrolled?: boolean }>`
  width: 100%;
  padding: 0 1.8rem;
  height: 6.8rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${(props) =>
    props.scrolled
      ? "0 0.2rem 1.2rem rgba(0, 0, 0, 0.1)"
      : "0 0 0 rgba(0, 0, 0, 0)"};
  transition: box-shadow 0.2s;
  position: sticky;
  top: 0;
  background: #fff;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div<{ scrolled?: boolean }>`
  height: 6.8rem;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  overflow: ${(props) => (props.scrolled ? "hidden" : "visible")};

  svg {
    height: 5.8rem;
    width: auto;
    margin: 0 0 -0.2rem;
  }
`;

const auth = getAuth();

export function TopBar() {
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
    <Container scrolled={scrolled} ref={containerRef as Ref<HTMLDivElement>}>
      <Inner>
        <Logo scrolled={scrolled}>
          <LogoSvg />
        </Logo>
      </Inner>
      <Inner>
        <Button onClick={() => auth.signOut()}>Logout</Button>
      </Inner>
    </Container>
  );
}
