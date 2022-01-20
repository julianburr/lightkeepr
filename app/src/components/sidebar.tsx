import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, ReactNode } from "react";
import styled from "styled-components";

import CreditCardSvg from "src/assets/icons/credit-card.svg";
import UsersSvg from "src/assets/icons/users.svg";
import SettingsSvg from "src/assets/icons/settings.svg";

const Container = styled.menu`
  width: 28rem;
  flex-shrink: 0;
  margin: 0 2.4rem 0 0;

  ul {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;

    li {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
    }
  }
`;

const Heading = styled.b`
  font-weight: 700;
  margin: 3.2rem 0 0.6rem;
`;

const A = styled.a<{ active?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.4rem;
  margin: 0.2rem -0.4rem;
  color: inherit;
  align-self: flex-start;
  justify-self: flex-start;
  text-decoration: ${(props) => (props.active ? "underline" : "none")};

  & svg {
    height: 1.2em;
    width: auto;
    margin: 0 0.6rem 0 0;
    transition: opacity 0.2s;
    stroke-width: 0.24rem;
  }

  &:focus,
  &:hover {
    text-decoration: underline;
  }
`;

type NavItemProps = ComponentProps<typeof Link> & {
  icon?: ReactNode;
};

function NavItem({ children, icon, ...props }: NavItemProps) {
  const router = useRouter();
  return (
    <li>
      <Link {...props} passHref>
        <A active={router.asPath === props?.href}>
          {icon}
          {children}
        </A>
      </Link>
    </li>
  );
}

export function Sidebar() {
  const router = useRouter();

  const { orgUserId } = router.query;

  return (
    <Container>
      <ul>
        <Heading>Projects</Heading>
        <NavItem href={`/app/${orgUserId}/project/xx`}>Example Project</NavItem>

        <Heading>Organisation</Heading>
        <NavItem icon={<UsersSvg />} href={`/app/${orgUserId}/users`}>
          Users
        </NavItem>
        <NavItem icon={<CreditCardSvg />} href={`/app/${orgUserId}/billing`}>
          Billing &amp; usage
        </NavItem>
        <NavItem icon={<SettingsSvg />} href={`/app/${orgUserId}/settings`}>
          Organisation settings
        </NavItem>
      </ul>
    </Container>
  );
}
