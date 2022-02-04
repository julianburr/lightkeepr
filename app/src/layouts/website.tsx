import Link from "next/link";
import { PropsWithChildren, useEffect, Ref } from "react";
import styled, { keyframes } from "styled-components";

import { Button } from "src/components/button";
import { Spacer } from "src/components/spacer";
import { Tooltip } from "src/components/tooltip";
import { TopBar } from "src/components/top-bar";
import { useSidebarState } from "src/hooks/use-sidebar-state";

import GithubSvg from "src/assets/icons/github.svg";
import MenuSvg from "src/assets/icons/menu.svg";
import TwitterSvg from "src/assets/icons/twitter.svg";
import DuckSvg from "src/assets/illustrations/rubber-duck.svg";
import WavesSvg from "src/assets/illustrations/waves.svg";
import LogoSvg from "src/assets/logo.svg";

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  font-size: 1.6rem;
  font-family: Lato;

  h1,
  h2,
  h3,
  h4 {
    line-height: 1.2;
  }
`;

const StyledTopBar = styled(TopBar)`
  && {
    transition: box-shadow 0.4s, background 0.4s, backdrop-filter 0.4s;

    &.scrolled {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(0.5rem);
    }
  }
`;

const Logo = styled.div`
  height: 6.8rem;
  display: flex;
  position: relative;

  a {
    height: 6.8rem;
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: center;
    position: relative;
    font-family: "Playfair Display";
    font-size: 2.2rem;
    color: inherit;
    font-weight: 800;

    &:hover,
    &:focus {
      text-decoration: none;
      color: inherit;
    }

    span {
      position: absolute;
      white-space: nowrap;
      top: 50%;
      transform: translate3d(0, -50%, 0);
      transition: transform 0.4s;
    }

    svg {
      height: 5.4rem;
      width: auto;
      opacity: 0;
      transition: opacity 0.4s;
      margin: 0 0 -0.6rem;
    }
  }

  .scrolled & {
    span {
      transform: translate3d(5.4rem, -50%, 0);
    }

    svg {
      opacity: 1;
    }
  }
`;

const Menu = styled.menu`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.8rem;

  a {
    color: inherit;
    font-family: "Playfair Display";
    font-size: 1.8rem;

    &:hover,
    &:focus {
      color: inherit;
    }
  }
`;

const Content = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

// #22c2fa
const Footer = styled.footer`
  width: 100%;
  background: var(--sol--color-brand-500);
  color: #fff;
  position: relative;
`;

const FooterInner = styled.div`
  width: 100%;
  max-width: 104rem;
  padding: 8.4rem 2.4rem 2.4rem;
  margin: 0 auto;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  a {
    opacity: 0.6;
    transition: opacity 0.2s;

    &:hover,
    &:active {
      opacity: 1;
    }

    &,
    &:hover,
    &:active {
      color: inherit;
    }
  }
`;

const Copyright = styled.div`
  font-family: "Playfair Display";
  display: flex;
  flex-direction: row;
  opacity: 0.6;
`;

const FooterLogo = styled.span`
  font-size: 2.4rem;
  font-weight: 800;
  margin: -1rem 0.8rem 0;
`;

const Social = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.2rem;
`;

const Waves = styled(WavesSvg)`
  position: absolute;
  right: 0;
  height: 3.2rem;
  width: auto;
  top: 1.8rem;
`;

const float = keyframes`
  0% { transform: rotate(0deg) translate3d(0,-.3rem,0); }
  35% { transform: rotate(4deg) translate3d(0,.3rem,0); }
  50% { transform: rotate(2deg) translate3d(0,-.3rem,0); }
  75% { transform: rotate(-3deg) translate3d(0,.3rem,0); }
  100% { transform: rotate(0deg) translate3d(0,-.3rem,0); }
`;

const Duck = styled(DuckSvg)`
  height: 6.4rem;
  width: auto;
  position: absolute;
  top: -3.6rem;
  right: 4rem;
  animation: ${float} 10s ease-in-out infinite;
`;

const Water = styled.div`
  background: var(--sol--color-brand-500);
  position: absolute;
  left: 0;
  width: 100%;
  top: 1.8rem;
  bottom: 0;
  opacity: 0.5;
`;

const MobileButton = styled(Button)`
  && {
    &:hover,
    &:focus {
      background: rgba(0, 0, 0, 0.05);
    }

    &:active,
    &.active {
      background: rgba(0, 0, 0, 0.1);
    }
  }
`;

const MobileSidebar = styled.div`
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
    display: none;
  }
`;

const MobileMenu = styled.menu`
  height: 100%;
  width: calc(100% - 2.4rem);
  max-width: 28rem;
  background: rgba(255, 255, 255, 0.9);
  transform: translateX(100%);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 3.2rem 3.2rem 6rem;
  font-family: "Playfair Display";
  font-size: 2.8rem;
  gap: 1.2rem;

  [data-active="true"] > & {
    box-shadow: 0 0 1.8rem rgba(0, 0, 0, 0.1);
    transform: translateX(0);
  }

  a,
  a:hover,
  a:focus {
    color: inherit;
  }
`;

type WebsiteLayoutProps = PropsWithChildren<Record<never, any>>;

export function WebsiteLayout({ children }: WebsiteLayoutProps) {
  const { menuRef, backdropRef, active, setActive } = useSidebarState();

  useEffect(() => {
    if (!active) {
      return;
    }

    const links = menuRef.current?.getElementsByTagName("a");
    if (!links?.length) {
      return;
    }

    function handleClick() {
      setActive(false);
    }

    for (let i = 0; i < links.length; i++) {
      links[i].addEventListener("click", handleClick);
    }
    return () => {
      for (let i = 0; i < links.length; i++) {
        links[i].removeEventListener("click", handleClick);
      }
    };
  }, [active]);

  return (
    <Container>
      <StyledTopBar
        logo={
          <Logo>
            <Link href="/">
              <a>
                <LogoSvg />
                <span>lightkeepr</span>
              </a>
            </Link>
          </Logo>
        }
        actions={
          <>
            <Menu data-tablet>
              <Link href="/#features">
                <a>Features</a>
              </Link>
              <Link href="/pricing">
                <a>Pricing</a>
              </Link>
              <Link href="/docs">
                <a>Documentation</a>
              </Link>
              <Link href="/auth/sign-in">
                <a>Sign in</a>
              </Link>
            </Menu>

            <MobileButton
              data-mobile
              icon={<MenuSvg />}
              size="large"
              intent="ghost"
              aria-label="Menu"
              onClick={() => {
                const event = new CustomEvent("toggleMobileMenu");
                window.document.body.dispatchEvent(event);
              }}
            />
          </>
        }
      />

      <MobileSidebar
        ref={backdropRef as Ref<HTMLDivElement>}
        data-active={active}
      >
        <MobileMenu ref={menuRef as Ref<HTMLMenuElement>}>
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/#features">
            <a>Features</a>
          </Link>
          <Link href="/pricing">
            <a>Pricing</a>
          </Link>
          <Link href="/documentation">
            <a>Documentation</a>
          </Link>
          <Spacer h="2.4rem" />
          <Link href="/auth/sign-in">
            <a>Sign in</a>
          </Link>
        </MobileMenu>
      </MobileSidebar>

      <Content>{children}</Content>

      <Footer>
        <FooterInner>
          <Copyright>
            <FooterLogo>lightkeepr</FooterLogo> &copy; 2022
          </Copyright>
          <Social>
            <Tooltip content="@jburr90 on Twitter">
              {(props) => (
                <a
                  {...props}
                  href="https://twitter.com/jburr90"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <TwitterSvg />
                </a>
              )}
            </Tooltip>
            <Tooltip content={"View on Github"}>
              {(props) => (
                <a
                  {...props}
                  href="https://github.com/julianburr/lightkeepr"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <GithubSvg />
                </a>
              )}
            </Tooltip>
          </Social>
        </FooterInner>

        <Waves />
        <Duck />
        <Water />
      </Footer>
    </Container>
  );
}
