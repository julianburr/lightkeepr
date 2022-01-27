import { Ref, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

import { useAuthUser } from "src/hooks/use-auth-user";
import { useSidebarState } from "src/hooks/use-sidebar-state";
import { Avatar } from "src/components/avatar";
import { Loader } from "src/components/loader";
import { P, Small } from "src/components/text";
import { Spacer } from "src/components/spacer";

import { TeamSelectInput } from "src/selects/team";

import { BaseSidebar } from "./base";
import { ProjectSidebar } from "./project";
import { RunSidebar } from "./run";
import { ReportSidebar } from "./report";
import { useLayoutEffect } from "react";
import { useSidebarLinkState } from "src/hooks/use-sidebar-link-state";

const Container = styled.div`
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
      width: 26rem;
      background: transparent;
      pointer-events: all;
      backdrop-filter: none;
    }
  }
`;

const Menu = styled.menu`
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
      max-height: calc(100% - 6.8rem);
      position: fixed;
      z-index: 10;
      top: 6.8rem;
      left: 0;
      bottom: 0;
      transform: translateX(0);
      box-shadow: none;
      width: 100%;
      transition: none;
    }
  }
`;

const TopContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.6rem 2.4rem;
  background: #f5f4f1;
  position: sticky;
  top: 0;
  z-index: 20;

  @media (min-width: 800px) {
    display: none;
  }
`;

const WrapProfile = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.8rem;
`;

const WrapName = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  p {
    margin: 0;
    line-height: 1.2;
  }
`;

const WrapContent = styled.div`
  padding: var(--sol--spacing-xl);
`;

type ContentProps = {
  projectId?: string;
  runId?: string;
  reportId?: string;
  getLinkProps: (state?: any) => any;
};

function Content({ projectId, runId, reportId, getLinkProps }: ContentProps) {
  if (reportId) {
    return <ReportSidebar reportId={reportId} getLinkProps={getLinkProps} />;
  }

  if (runId) {
    return <RunSidebar runId={runId} getLinkProps={getLinkProps} />;
  }

  if (projectId) {
    return <ProjectSidebar projectId={projectId} getLinkProps={getLinkProps} />;
  }

  return <BaseSidebar getLinkProps={getLinkProps} />;
}

export function Sidebar() {
  const router = useRouter();
  const authUser = useAuthUser();

  const { menuRef, backdropRef, active } = useSidebarState();

  // State for team switcher
  const teamValue = { value: authUser.team?.id, label: authUser.team?.name };
  const handleTeamChange = useCallback(
    (team) => {
      if (team && router.query.teamId !== team.value) {
        router.push(`/app/${team.value}`);
      }
    },
    [router.query.teamId]
  );

  // HACK: this is a pretty convoluted way to allow the user to go through
  // the menu structure without navigating until they hit a final link,
  // but we only want this behaviour on mobile :/
  const topContainerRef = useRef<HTMLDivElement>();
  const [isMobile, setMobile] = useState(false);
  useEffect(() => {
    function handleResize() {
      setMobile(!!topContainerRef?.current?.clientHeight);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { projectId, runId, reportId, getLinkProps } = useSidebarLinkState({
    active,
    isMobile,
    menuRef,
  });

  return (
    <Container ref={backdropRef as Ref<HTMLDivElement>} data-active={active}>
      <Menu ref={menuRef as Ref<HTMLMenuElement>}>
        <TopContainer ref={topContainerRef as Ref<HTMLDivElement>}>
          <WrapProfile>
            <Avatar
              background="#3dc5ce"
              color="#fff"
              name={authUser?.user?.name}
            />
            <WrapName>
              <P>{authUser?.user?.name}</P>
              <Spacer h=".3rem" />
              <Small grey>{authUser?.user?.id}</Small>
            </WrapName>
          </WrapProfile>

          <TeamSelectInput
            name="team"
            value={teamValue}
            onChange={handleTeamChange}
          />
        </TopContainer>

        <Suspense fallback={<Loader />}>
          <WrapContent>
            <Content
              projectId={projectId}
              runId={runId}
              reportId={reportId}
              getLinkProps={getLinkProps}
            />
          </WrapContent>
        </Suspense>
      </Menu>
    </Container>
  );
}
