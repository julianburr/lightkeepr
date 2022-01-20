import styled from "styled-components";

import LogoSvg from "src/assets/logo.svg";
import { getAuth } from "firebase/auth";
import { Button } from "./button";
import { useEffect, useRef, useState } from "react";
import { Ref } from "react";
import { useAuthUser } from "src/hooks/use-auth-user";
import { Avatar } from "./avatar";

import BellSvg from "src/assets/icons/bell.svg";
import GiftSvg from "src/assets/icons/gift.svg";
import { Tooltip } from "./tooltip";
import Link from "next/link";
import { useRouter } from "next/router";
import { ActionMenu } from "./action-menu";
import { Bold, P, Small } from "./text";
import { Spacer } from "./spacer";

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

export function TopBar() {
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
        {authUser.organisationUsers?.length ? (
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
            <ActionMenu
              placement="bottom-end"
              items={[
                {
                  items: [
                    {
                      isCustom: true,
                      Content: () => (
                        <>
                          <P>
                            You are currently logged in as {authUser.user.name}
                          </P>
                          <Spacer h=".3rem" />
                          <Small grey>{authUser.user.id}</Small>
                        </>
                      ),
                    },
                  ],
                },
                {
                  label: "Accounts",
                  items: authUser.organisationUsers.map((u: any) => ({
                    selectable: true,
                    selected: u.id === router.query.orgUserId,
                    label: u.id,
                    href: `/app/${u.id}`,
                  })),
                },
                {
                  items: [
                    {
                      label: "Account settings",
                      href: `/app/${router.query.orgUserId}/account/settings`,
                    },
                    {
                      label: "Sign out",
                      onClick: () => auth.signOut(),
                    },
                  ],
                },
              ]}
            >
              {(props) => <Avatar name={authUser.user.name} {...props} />}
            </ActionMenu>
          </>
        ) : (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        )}
      </Inner>
    </Container>
  );
}
