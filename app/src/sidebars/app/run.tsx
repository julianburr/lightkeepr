import "src/utils/firebase";

import dayjs from "dayjs";
import {
  collection,
  doc,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import styled, { keyframes } from "styled-components";

import { useCollection, useDocument } from "src/@packages/firebase";
import { Menu } from "src/components/menu";
import { Meta } from "src/components/meta";
import { Spacer } from "src/components/spacer";
import { formatMs } from "src/utils/format";

import ArrowLeftSvg from "src/assets/icons/outline/arrow-left.svg";
import LoaderSvg from "src/assets/icons/outline/loader.svg";

const db = getFirestore();

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderIcon = styled(LoaderSvg)`
  height: 0.8em;
  width: auto;
  vertical-align: middle;
  margin: -0.1rem 0.3rem 0 0;
  animation: ${spin} 3s ease-in-out infinite;
`;

type RunSidebarProps = {
  runId: string;
  getLinkProps: (state: any) => any;
};

export function RunSidebar({ runId, getLinkProps }: RunSidebarProps) {
  const runRef = doc(db, "runs", runId);
  const run = useDocument(runRef);

  const reports = useCollection(
    query(
      collection(db, "reports"),
      where("run", "==", runRef),
      orderBy("name", "asc")
    ),
    { key: `${runId}/reports` }
  );

  const items = [
    {
      icon: <ArrowLeftSvg />,
      label: "Back to project overview",
      isBacklink: true,
      ...getLinkProps({ projectId: run.project.id }),
    },

    {
      label: "Reports",
      items: reports.map((report: any) => ({
        label: report.name || report.url,
        ...getLinkProps({ reportId: report.id }),
      })),
    },
  ];

  const meta = [
    run.branch && {
      label: "Branch",
      value: run.branch,
    },
    run.commit && {
      label: "Commit",
      value: run.commit,
    },
    {
      label: "Status",
      value:
        run.status?.value === "passed" ? (
          "Passed"
        ) : run.status?.value === "running" ? (
          <>
            <LoaderIcon />
            <span>Running</span>
          </>
        ) : run.status?.value === "failed" ? (
          "Failed"
        ) : run.status?.value === "cancelled" ? (
          "Cancelled"
        ) : (
          run.status?.value
        ),
    },
    {
      label: "Started at",
      value: run.startedAt
        ? dayjs.unix(run.startedAt.seconds).format("D MMM YYYY h:mma")
        : null,
    },
    {
      label: "Duration",
      value: run.finishedAt
        ? formatMs((run.finishedAt.seconds - run.startedAt.seconds) * 1000)
        : null,
    },
  ].filter(Boolean);

  return (
    <>
      <Menu items={items} />

      <Spacer h="2.4rem" />
      <Meta data={meta} />
    </>
  );
}
