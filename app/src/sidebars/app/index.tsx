import { useRouter } from "next/router";
import { useCallback, RefObject } from "react";
import styled from "styled-components";

import { Avatar } from "src/components/avatar";
import { ErrorBoundary, ErrorMessage } from "src/components/error-boundary";
import { Menu } from "src/components/menu";
import { Sidebar } from "src/components/sidebar";
import { Spacer } from "src/components/spacer";
import { Suspense } from "src/components/suspense";
import { P, Small } from "src/components/text";
import { useAuthUser } from "src/hooks/use-auth-user";
import { useSidebarLinkState } from "src/hooks/use-sidebar-link-state";
import { TeamSelectInput } from "src/selects/team";

import ArrowLeftSvg from "src/assets/icons/arrow-left.svg";

import { BaseSidebar } from "./base";
import { CompareSidebar } from "./compare";
import { ProjectSidebar } from "./project";
import { ReportSidebar } from "./report";
import { RunSidebar } from "./run";

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

type ContentProps = {
  active: boolean;
  isMobile: boolean;
  menuRef: RefObject<HTMLMenuElement | undefined>;
};

function Fallback({ active, isMobile, menuRef }: ContentProps) {
  const { projectId, runId, reportId, getLinkProps } = useSidebarLinkState({
    active,
    isMobile,
    menuRef,
  });

  const resource = reportId
    ? "report"
    : runId
    ? "run"
    : projectId
    ? "project"
    : "resource";

  return (
    <>
      <Menu
        items={[
          {
            icon: <ArrowLeftSvg />,
            label: "Back to team overview",
            isBacklink: true,
            ...getLinkProps(),
          },
        ]}
      />
      <Spacer h="1.2rem" />
      <ErrorMessage>
        <P grey>
          Failed to load the {resource} requested. Make sure it has not been
          deleted or belongs to another team.
        </P>
      </ErrorMessage>
    </>
  );
}

function Content({ active, isMobile, menuRef }: ContentProps) {
  const { projectId, runId, reportId, reportIds, getLinkProps } =
    useSidebarLinkState({
      active,
      isMobile,
      menuRef,
    });

  if (reportIds) {
    return <CompareSidebar reportIds={reportIds} getLinkProps={getLinkProps} />;
  }

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

export function AppSidebar() {
  const router = useRouter();
  const authUser = useAuthUser();

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

  return (
    <Sidebar
      top={
        <>
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
        </>
      }
    >
      {({ isMobile, active, menuRef }) => (
        <ErrorBoundary
          fallback={() => (
            <Fallback isMobile={isMobile} active={active} menuRef={menuRef} />
          )}
        >
          <Suspense fallback={null}>
            <Content isMobile={isMobile} active={active} menuRef={menuRef} />
          </Suspense>
        </ErrorBoundary>
      )}
    </Sidebar>
  );
}
