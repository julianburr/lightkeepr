import "src/utils/firebase";

import { useCallback, useEffect, useMemo, useRef, useState, Ref } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { useCollection } from "src/@packages/firebase";
import { useAuthUser } from "src/hooks/use-auth-user";

import { Menu } from "./menu";

import BellSvg from "src/assets/icons/bell.svg";
import GridSvg from "src/assets/icons/grid.svg";
import LifeBuoySvg from "src/assets/icons/life-buoy.svg";
import { P, Small } from "./text";
import { Spacer } from "./spacer";
import { Form } from "./form";
import { Field } from "./field";
import { TeamSelectInput } from "src/selects/team";
import { useForm } from "react-cool-form";
import { Avatar } from "./avatar";

const auth = getAuth();
const db = getFirestore();

const Container = styled.menu`
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
    &,
    &[data-active="true"] {
      z-index: 2;
      position: relative;
      width: 24rem;
      background: transparent;
      pointer-events: all;
      backdrop-filter: none;
    }
  }
`;

const Inner = styled.div`
  height: 100%;
  width: calc(100% - 2.4rem);
  max-width: 28rem;
  background: #fff;
  transform: translateX(100%);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: auto;

  [data-active="true"] > & {
    box-shadow: 0 0 1.8rem rgba(0, 0, 0, 0.1);
    transform: translateX(0);
  }

  @media (min-width: 800px) {
    && {
      transform: translateX(0);
      box-shadow: none;
      width: 100%;
      transition: none;
    }
  }
`;

const WrapProfile = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 2.4rem;
  background: #f5f4f1;
  position: sticky;
  top: 0;
  z-index: 20;

  @media (min-width: 800px) {
    display: none;
  }
`;

const WrapInner = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  p {
    margin: 0;
    line-height: 1.2;
  }
`;

const WrapTeamSelect = styled.div`
  width: 100%;
  padding: 2.4rem 2.4rem 0;

  @media (min-width: 800px) {
    display: none;
  }
`;

export function Sidebar() {
  const authUser = useAuthUser();

  const router = useRouter();

  // Mobile sidebar behaviours
  const [active, setActive] = useState(false);
  useEffect(() => {
    function handleToggle() {
      setActive((state) => !state);
    }
    window.document.body.addEventListener("toggleMobileMenu", handleToggle);
    return () =>
      window.document.body.removeEventListener(
        "toggleMobileMenu",
        handleToggle
      );
  }, []);

  const innerRef = useRef<HTMLDivElement>();
  const handleBackgroundClick = useCallback((e: any) => {
    if (innerRef.current && !innerRef.current.contains(e.target)) {
      setActive(false);
    }
  }, []);

  useEffect(() => {
    if (!active || !innerRef.current) {
      return;
    }

    let touchstartX = 0;

    function handleTouchStart(e: any) {
      touchstartX = e.changedTouches[0].screenX;
    }

    function handleTouchMove(e: any) {
      if (!innerRef.current) {
        return;
      }

      const moved = e.changedTouches[0].screenX - touchstartX;
      if (moved > 15) {
        e.preventDefault();
        e.stopPropagation();
        innerRef.current.style.transform = `translateX(calc(${moved}px)`;
      }
    }

    function handleTouchEnd(e: any) {
      if (!innerRef.current) {
        return;
      }
      const moved = e.changedTouches[0].screenX - touchstartX;
      innerRef.current.style.transform = "";
      if (moved > 80) {
        setActive(false);
      }
    }

    const el = innerRef.current;
    el.addEventListener("touchstart", handleTouchStart);
    el.addEventListener("touchend", handleTouchEnd);
    el.addEventListener("touchmove", handleTouchMove);
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("touchmove", handleTouchMove);
    };
  }, [active]);

  // Put together menu items
  const teamId = router.query.teamId as string;
  const projects = useCollection(
    query(
      collection(db, "projects"),
      where("team", "==", doc(db, "teams", teamId)),
      orderBy("name", "asc")
    ),
    { key: `${teamId}/projects` }
  );

  const project = projects?.find?.((p: any) => p.id === router.query.projectId);

  const items = useMemo(() => {
    return [
      {
        mobile: true,
        label: "App switcher",
        icon: <GridSvg />,
        onClick: () => alert("Hi!"),
      },
      {
        mobile: true,
        label: "Notifications",
        icon: <BellSvg />,
        href: `/app/${router.query.teamId}/account/notifications`,
      },
      {
        mobile: true,
        label: "Support",
        icon: <LifeBuoySvg />,
        href: `/app/${router.query.teamId}/account/support`,
      },

      ...(projects?.length
        ? [
            {
              label: "Projects",
              items: projects.map((p: any) => ({
                label: p.name,
                href: `/app/${router.query.teamId}/projects/${p.id}`,
              })),
            },
          ]
        : []),

      ...(project?.id
        ? [
            {
              label: project.name,
              items: [
                {
                  label: "Integrations",
                  href: `/app/${router.query.teamId}/projects/${project.id}/integrations`,
                },
                {
                  label: "Settings",
                  href: `/app/${router.query.teamId}/projects/${project.id}/settings`,
                },
              ],
            },
          ]
        : []),

      {
        label: "Team",
        items: [
          {
            label: "Overview",
            href: `/app/${router.query.teamId}`,
          },
          {
            label: "Users",
            href: `/app/${router.query.teamId}/users`,
          },
          {
            label: "Billing & usage",
            href: `/app/${router.query.teamId}/billing`,
          },
          {
            label: "Settings",
            href: `/app/${router.query.teamId}/settings`,
          },
        ],
      },

      {
        mobile: true,
        label: "Account",
        items: [
          {
            label: "Create a new team",
            href: `/app/${router.query.teamId}/account/teams/new`,
          },
          {
            label: "Profile settings",
            href: `/app/${router.query.teamId}/account/settings`,
          },
          {
            label: "Sign out",
            onClick: () => auth.signOut(),
          },
        ],
      },
    ];
  }, [authUser, projects, project]);

  // Form for the team switcher
  const teamValue = { value: authUser.team?.id, label: authUser.team?.name };
  const handleTeamChange = useCallback(
    (team) => {
      if (team && teamId !== team.value) {
        router.push(`/app/${team.value}`);
      }
    },
    [teamId]
  );

  return (
    <Container data-active={active} onClick={handleBackgroundClick}>
      <Inner ref={innerRef as Ref<HTMLDivElement>}>
        <WrapProfile>
          <Avatar
            background="#3dc5ce"
            color="#fff"
            name={authUser?.user?.name}
          />
          <Spacer w="1.2rem" />
          <WrapInner>
            <P>You are currently logged in as {authUser?.user?.name}</P>
            <Spacer h=".3rem" />
            <Small grey>{authUser?.user?.id}</Small>
          </WrapInner>
        </WrapProfile>

        <WrapTeamSelect>
          <TeamSelectInput
            name="team"
            value={teamValue}
            onChange={handleTeamChange}
          />
        </WrapTeamSelect>

        <Menu items={items} />
      </Inner>
    </Container>
  );
}
