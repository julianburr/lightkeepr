import { useEffect, useRef, useState, Ref } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";

import { useAuthUser } from "src/hooks/use-auth-user";
import { AccountActionMenu } from "src/action-menus/account";

import { Button } from "./button";
import { Tooltip } from "./tooltip";
import { Spacer } from "./spacer";

import LogoSvg from "src/assets/logo.svg";
import BellSvg from "src/assets/icons/bell.svg";
import SearchSvg from "src/assets/icons/search.svg";
import LifeBuoySvg from "src/assets/icons/life-buoy.svg";
import GridSvg from "src/assets/icons/grid.svg";
import MenuSvg from "src/assets/icons/menu.svg";

const Container = styled.header<{ scrolled?: boolean }>`
  width: 100%;
  padding: 0 2.4rem;
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
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  &[data-mobile] {
    display: flex;

    @media (min-width: 800px) {
      display: none;
    }
  }

  &[data-tablet] {
    display: none;

    @media (min-width: 800px) {
      display: flex;
    }
  }
`;

const Logo = styled.div<{ scrolled?: boolean }>`
  height: 6.8rem;
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: flex-end;
  overflow: ${(props) => (props.scrolled ? "hidden" : "visible")};
  margin: 0 0 0 -0.6rem;
  position: relative;
  z-index: 2;

  svg {
    height: 5.4rem;
    width: auto;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: opacity 0.2s;
  gap: 0.6rem;

  & > * {
    margin: 0;

    &:last-child {
      margin: 0;
    }
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
      <Logo scrolled={scrolled}>
        <Link href={`/app/${router.query.teamId}`}>
          <a>
            <LogoSvg />
          </a>
        </Link>
      </Logo>

      {setup ? (
        <>
          <Inner>
            <Button onClick={() => auth.signOut()}>Logout</Button>
          </Inner>
        </>
      ) : (
        <>
          <Inner data-tablet>
            <Buttons>
              <Tooltip content="Search (cmd+k)">
                {(props) => <Button {...props} icon={<SearchSvg />} />}
              </Tooltip>
              <Tooltip content="Notifications">
                {(props) => <Button {...props} icon={<BellSvg />} />}
              </Tooltip>
              <Tooltip content="Support">
                {(props) => <Button {...props} icon={<LifeBuoySvg />} />}
              </Tooltip>

              <Spacer w="1.2rem" />

              <Tooltip content="App switcher">
                {(props) => <Button {...props} icon={<GridSvg />} />}
              </Tooltip>

              <Spacer w="1.2rem" />

              <AccountActionMenu>
                {(props) => (
                  <Button
                    {...props}
                    intend="primary"
                    icon={
                      <>
                        {authUser?.user?.name
                          ?.split?.(" ")
                          .filter(Boolean)
                          .reduce((all, w, index, names) => {
                            if (index === 0 || index === names.length - 1) {
                              all += w[0];
                            }
                            return all;
                          }, "")}
                      </>
                    }
                  />
                )}
              </AccountActionMenu>
            </Buttons>
          </Inner>

          <Inner data-mobile>
            <Button
              icon={<SearchSvg />}
              size="large"
              weight="ghost"
              onClick={() => {
                alert("search");
              }}
            />
            <Button
              icon={<MenuSvg />}
              size="large"
              weight="ghost"
              onClick={() => {
                const event = new CustomEvent("toggleMobileMenu");
                window.document.body.dispatchEvent(event);
              }}
            />
          </Inner>
        </>
      )}
    </Container>
  );
}
