import { useEffect, useRef, useState, Ref } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";

import { useAuthUser } from "src/hooks/use-auth-user";
import { AccountActionMenu } from "src/action-menus/account";

import { Button } from "./button";
import { Tooltip } from "./tooltip";

import LogoSvg from "src/assets/logo.svg";
import BellSvg from "src/assets/icons/bell.svg";
import GiftSvg from "src/assets/icons/gift.svg";

const Container = styled.header<{ scrolled?: boolean }>`
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
  z-index: 100;
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

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 2.4rem 0 0;
  transition: opacity 0.2s;

  &:hover,
  &:focus {
    opacity: 0.7;
  }
`;

const IconButton = styled.button`
  border: 0 none;
  background: transparent;
  padding: 0.8rem;
  display: flex;
  margin: 0 0.6rem 0 0;
  border-radius: 50%;

  svg {
    height: 1.6rem;
    width: auto;
    display: flex;
    stroke-width: 0.25rem;
  }
`;

const auth = getAuth();

type TopBarProps = {
  setup?: boolean;
};

export function TopBar({ setup }: TopBarProps) {
  const router = useRouter();
  const authUser = useAuthUser();

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
          <Link href={`/app/${router.query.orgUserId}`}>
            <a>
              <LogoSvg />
            </a>
          </Link>
        </Logo>
      </Inner>
      <Inner>
        {setup ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <>
            <Buttons>
              <Tooltip content="Notifications">
                {(props) => (
                  <IconButton {...props}>
                    <BellSvg />
                  </IconButton>
                )}
              </Tooltip>
              <Tooltip content="Feature release notes">
                {(props) => (
                  <IconButton {...props}>
                    <GiftSvg />
                  </IconButton>
                )}
              </Tooltip>
            </Buttons>
            <AccountActionMenu />
          </>
        )}
      </Inner>
    </Container>
  );
}
