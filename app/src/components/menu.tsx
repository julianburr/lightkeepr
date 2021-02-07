import firebase from "firebase/app";
import { useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

import { useAuth } from "../hooks/@firebase";

import { Spacer } from "./spacer";
import { ActionMenu } from "./action-menu";

import { ReactComponent as MenuSvg } from "../assets/icons/menu.svg";
import { ReactComponent as XSvg } from "../assets/icons/x.svg";

type ContainerProps = {
  open?: boolean;
};

const Container = styled.div<ContainerProps>`
  @media (max-width: 800px) {
    &:before {
      content: " ";
      position: fixed;
      z-index: 90;
      background: #222;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: ${(props) => (props.open ? "all" : "none")};
      transition: opacity 0.2s;
      opacity: ${(props) => (props.open ? 0.8 : 0)};
    }
  }
`;

const Mobile = styled.div`
  display: none;

  @media (max-width: 800px) {
    display: flex;
  }
`;

const Desktop = styled.div`
  display: flex;

  @media (max-width: 800px) {
    display: none;
  }
`;

const MenuButton = styled.button`
  cursor: pointer;
  border: 0 none;
  background: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 4rem;
  width: 4rem;

  & svg {
    height: 2.8rem;
    width: auto;
  }
`;

const CloseButton = styled(MenuButton)`
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
`;

type InnerContainerProps = {
  open?: boolean;
};

const InnerContainer = styled.div<InnerContainerProps>`
  display: flex;
  flex-direction: row;
  align-items: center;

  @media (max-width: 800px) {
    flex-direction: column;
    align-items: flex-start;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    width: 90%;
    max-width: 30rem;
    z-index: 100;
    background: #fff;
    transition: transform 0.2s;
    transform: ${(props) =>
      props.open ? `translateX(0)` : `translateX(110%)`};
    pointer-events: ${(props) => (props.open ? "all" : "none")};
    width: 100%;
  }
`;

const MenuContainer = styled.menu`
  margin: 0;
  padding: 0;

  & ul {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;

    & li {
      list-style: none;
      padding: 0;
      margin: 0 0.2rem;

      & a,
      & button {
        margin: 0;
        text-align: inherit;
        border: 0 none;
        background: none;
        padding: 0.8rem;
        border-radius: 0.2rem;
        text-decoration: none;
        font-weight: 600;
        font-size: 1.2rem;
        text-transform: uppercase;
        color: inherit;
        transition: background 0.2s;
        cursor: pointer;
        line-height: 1.4rem;
        display: inline-block;

        &:hover {
          background: #fafafa;
        }

        &.active {
          &,
          &:hover {
            background: #f4f4f4;
          }
        }
      }
    }
  }

  @media (max-width: 800px) {
    padding: 2rem;
    width: 100%;

    & ul {
      flex-direction: column;
      padding-bottom: 2.4rem;

      & li {
        margin: 0.4rem 0;

        & a,
        & button {
          font-size: 1.6rem;
        }
      }
    }
  }
`;

const Avatar = styled.div`
  width: 3.6rem;
  height: 3.6rem;
  background-color: green;
  border-radius: 50%;
  border: 0 none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0;
  overflow: hidden;

  & span {
    font-size: 1.6rem;
    font-weight: 600;
  }

  & img {
    object-fit: fill;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  @media (max-width: 800px) {
    width: 4.8rem;
    height: 4.8rem;
    border-radius: 0.2rem;
  }
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 0 2.4rem;
  margin: 2.4rem 0 2.4rem;
  border-bottom: 0.1rem solid #f4f4f4;
  width: 100%;

  & > * {
    margin-left: 1.2rem;

    &:first-child {
      margin-left: 0;
    }
  }
`;

const AvatarMeta = styled.div`
  display: flex;
  flex-direction: column;
`;

const AvatarName = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  text-transform: uppercase;
`;

const AvatarEmail = styled.div`
  font-size: 1.2rem;
  color: #666;
`;

export function Menu() {
  const authUser = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <Container open={open} onClick={() => setOpen(false)}>
      <Mobile>
        <MenuButton
          onClick={(e) => {
            setOpen((state) => !state);
            e.stopPropagation();
          }}
        >
          <MenuSvg />
        </MenuButton>
      </Mobile>

      <InnerContainer open={open} onClick={(e) => e.stopPropagation()}>
        <MenuContainer>
          <Mobile>
            <CloseButton onClick={() => setOpen(false)}>
              <XSvg />
            </CloseButton>

            <AvatarContainer>
              <Avatar>
                <span>{authUser.displayName[0]}</span>
                {authUser.photoURL && (
                  <img src={authUser.photoURL} alt={authUser.displayName[0]} />
                )}
              </Avatar>
              <AvatarMeta>
                <AvatarName>{authUser.displayName}</AvatarName>
                <AvatarEmail>{authUser.email}</AvatarEmail>
              </AvatarMeta>
            </AvatarContainer>
          </Mobile>
          <ul>
            <li>
              <NavLink exact to="/" onClick={() => setOpen(false)}>
                Projects
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/usage" onClick={() => setOpen(false)}>
                Usage
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/integrations" onClick={() => setOpen(false)}>
                Integrations
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/plans" onClick={() => setOpen(false)}>
                Plans &amp; Pricing
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/docs" onClick={() => setOpen(false)}>
                Docs
              </NavLink>
            </li>
          </ul>
          <Mobile>
            <ul>
              <li>
                <NavLink exact to="/profile" onClick={() => setOpen(false)}>
                  Profile
                </NavLink>
              </li>
              <li>
                <button onClick={() => firebase.auth().signOut()}>
                  Logout
                </button>
              </li>
            </ul>
          </Mobile>
        </MenuContainer>
        <Spacer width="1.2rem" />
        <Desktop>
          <ActionMenu
            items={[
              {
                label: "Profile",
                path: "/profile",
              },
              {
                label: "Logout",
                onClick: () => firebase.auth().signOut(),
              },
            ]}
            placement="bottom-end"
          >
            <Avatar>
              <span>{authUser.displayName[0]}</span>
              {authUser.photoURL && (
                <img src={authUser.photoURL} alt={authUser.displayName[0]} />
              )}
            </Avatar>
          </ActionMenu>
        </Desktop>
      </InnerContainer>
    </Container>
  );
}
