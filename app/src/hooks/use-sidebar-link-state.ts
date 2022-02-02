import { useRouter } from "next/router";
import { RefObject, useCallback, useLayoutEffect, useState } from "react";

type useSidebarLinkStateArgs = {
  active: boolean;
  isMobile: boolean;
  menuRef: RefObject<HTMLMenuElement | undefined>;
};

export function useSidebarLinkState({
  active,
  isMobile,
  menuRef,
}: useSidebarLinkStateArgs) {
  const router = useRouter();

  const [mobileState, setMobileState] = useState({
    projectId: router.query.projectId,
    runId: router.query.runId,
    reportId: router.query.reportId,
    reportIds: router.query.reportIds,
  });

  useLayoutEffect(() => {
    if (active) {
      return;
    }

    function handleTransitionEnd() {
      setMobileState({
        projectId: router.query.projectId,
        runId: router.query.runId,
        reportId: router.query.reportId,
        reportIds: router.query.reportIds,
      });
      menuRef.current?.removeEventListener?.(
        "transitionend",
        handleTransitionEnd
      );
    }

    menuRef.current?.addEventListener?.("transitionend", handleTransitionEnd);
    return () =>
      menuRef.current?.removeEventListener?.(
        "transitionend",
        handleTransitionEnd
      );
  }, [active]);

  const projectId = isMobile ? mobileState.projectId : router.query.projectId;
  const runId = isMobile ? mobileState.runId : router.query.runId;
  const reportId = isMobile ? mobileState.reportId : router.query.reportId;
  const reportIds = isMobile ? mobileState.reportIds : router.query.reportIds;

  const getLinkProps = useCallback(
    (state = {}) => {
      if (isMobile) {
        return {
          onClick: () => setMobileState(state),
        };
      }
      return {
        href: state?.reportId
          ? `/app/${router.query.teamId}/reports/${state.reportId}`
          : state?.runId
          ? `/app/${router.query.teamId}/runs/${state.runId}`
          : state?.projectId
          ? `/app/${router.query.teamId}/projects/${state.projectId}`
          : `/app/${router.query.teamId}`,
      };
    },
    [isMobile, router.query.teamId]
  );

  return { projectId, runId, reportId, reportIds, getLinkProps };
}
