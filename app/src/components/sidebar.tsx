import "src/utils/firebase";

import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, ReactNode } from "react";
import styled from "styled-components";
import {
  collection,
  doc,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

import { useCollection } from "src/@packages/firebase";
import { useAuthUser } from "src/hooks/use-auth-user";

import { Button } from "./button";

import CreditCardSvg from "src/assets/icons/credit-card.svg";
import UsersSvg from "src/assets/icons/users.svg";
import SettingsSvg from "src/assets/icons/settings.svg";
import PlusSvg from "src/assets/icons/plus.svg";

const db = getFirestore();

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
  const authUser = useAuthUser();

  const router = useRouter();
  const { orgUserId } = router.query;

  const orgId = authUser.organisationUser?.organisation?.id;
  const projects = useCollection(
    orgId
      ? query(
          collection(db, "projects"),
          where("organisation", "==", doc(db, "organisations", orgId))
        )
      : undefined,
    { key: `${orgUserId}/projects` }
  );

  return (
    <Container>
      <ul>
        <Heading>Projects</Heading>
        {projects?.length ? (
          projects.map((project: any) => (
            <NavItem
              key={project.id}
              href={`/app/${orgUserId}/projects/${project.id}`}
            >
              {project.name}
            </NavItem>
          ))
        ) : (
          <Button icon={<PlusSvg />} href={`/app/${orgUserId}/projects/new`}>
            Create Project
          </Button>
        )}

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
