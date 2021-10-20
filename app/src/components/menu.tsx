import { useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";

import { getFirestore, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { useDocument } from "../@packages/firebase";
import { OrganisationSelect } from "./organisation-select";

const db = getFirestore();
const auth = getAuth();

type OpenProps = {
  open?: boolean;
};

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: #000;
  z-index: 100;
  transition: opacity 0.2s;
  opacity: ${(props: OpenProps) => (props.open ? 0.1 : 0)};
  pointer-events: ${(props: OpenProps) => (props.open ? "all" : "none")};
`;

const Container = styled.menu`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  width: 95%;
  max-width: 32rem;
  background: #fff;
  padding: 2.4rem;
  transition: transform 0.3s;
  transform: ${(props: OpenProps) =>
    props.open ? `translateX(0)` : `translateX(100%)`};
  z-index: 101;
`;

const Ul = styled.ul`
  margin-top: 2.4rem;

  &:first-child {
    margin-top: 0;
  }

  li {
    padding: 0.6rem 0;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.6rem;
  right: 1.6rem;
`;

type MenuProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  menu: any;
};

export function Menu({ open, setOpen, menu }: MenuProps) {
  const router = useRouter();
  useEffect(
    () => {
      if (open) {
        setOpen(false);
      }
    },
    // eslint-disable-next-line
    [router.asPath]
  );

  const projectDoc = router.query.projectId
    ? doc(db, "projects", router.query.projectId)
    : undefined;

  const project = useDocument(projectDoc);

  return (
    <>
      <Backdrop open={open} onClick={() => setOpen(false)} />
      <Container open={open}>
        <CloseButton onClick={() => setOpen(false)}>&times;</CloseButton>

        <Ul>
          <li>
            <OrganisationSelect />
          </li>
          <li>
            <Link href={`/${router.query.orgId}/settings/profile`}>
              Profile Settings
            </Link>
          </li>
        </Ul>

        {project?.id && (
          <Ul>
            <li>
              <h3>Project: {project.name}</h3>
            </li>
            <li>
              <Link href={`/${router.query.orgId}/projects/${project.id}`}>
                Runs
              </Link>
            </li>
            <li>
              <Link
                href={`/${router.query.orgId}/projects/${project.id}/integrations`}
              >
                Integrations
              </Link>
            </li>
            <li>
              <Link
                href={`/${router.query.orgId}/projects/${project.id}/settings`}
              >
                Settings
              </Link>
            </li>
          </Ul>
        )}

        <Ul>
          <li>
            <Link href={`/${router.query.orgId}`}>Dashboard</Link>
          </li>
          <li>
            <Link href={`/${router.query.orgId}/projects`}>Projects</Link>
          </li>

          <li>
            <Link href={`/${router.query.orgId}/settings/organisation`}>
              Organisation Settings
            </Link>
          </li>
          <li>
            <Link href={`/${router.query.orgId}/settings/organisation`}>
              Billing &amp; Usage
            </Link>
          </li>
        </Ul>

        <Ul>
          <li>
            <a href="https://google.com" target="_blank" rel="noreferrer">
              Documentation
            </a>
          </li>
          <li>
            <a href="https://google.com" target="_blank" rel="noreferrer">
              Github
            </a>
          </li>
          <li>
            <button
              onClick={() => {
                auth.signOut();
                setOpen(false);
              }}
            >
              Logout
            </button>
          </li>
        </Ul>
      </Container>
    </>
  );
}
