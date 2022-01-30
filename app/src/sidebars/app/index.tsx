import { useCallback, RefObject } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

import { useAuthUser } from "src/hooks/use-auth-user";
import { useSidebarLinkState } from "src/hooks/use-sidebar-link-state";
import { Avatar } from "src/components/avatar";
import { Loader } from "src/components/loader";
import { P, Small } from "src/components/text";
import { Spacer } from "src/components/spacer";
import { Sidebar } from "src/components/sidebar";
import { Suspense } from "src/components/suspense";

import { TeamSelectInput } from "src/selects/team";

import { BaseSidebar } from "./base";
import { ProjectSidebar } from "./project";
import { RunSidebar } from "./run";
import { ReportSidebar } from "./report";

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

function Content({ active, isMobile, menuRef }: ContentProps) {
  const { projectId, runId, reportId, getLinkProps } = useSidebarLinkState({
    active,
    isMobile,
    menuRef,
  });

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
        <Content isMobile={isMobile} active={active} menuRef={menuRef} />
      )}
    </Sidebar>
  );
}
