import "src/utils/firebase";

import {
  collection,
  doc,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";

import { useCollection, useDocument } from "src/@packages/firebase";
import { Menu } from "src/components/menu";
import { Spacer } from "src/components/spacer";
import { Meta } from "src/components/meta";

import ArrowLeftSvg from "src/assets/icons/arrow-left.svg";
import dayjs from "dayjs";

const db = getFirestore();

type RunSidebarProps = {
  runId: string;
};

export function RunSidebar({ runId }: RunSidebarProps) {
  const router = useRouter();

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
      href: `/app/${router.query.teamId}/projects/${run.project.id}`,
      isBacklink: true,
    },

    {
      label: "Reports",
      items: reports.map((report: any) => ({
        label: report.name || report.url,
        href: `/app/${router.query.teamId}/reports/${report.id}`,
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
      value: run.status,
    },
    {
      label: "Started at",
      value: run.startedAt
        ? dayjs.unix(run.startedAt.seconds).format("D MMM YYYY h:mma")
        : null,
    },
    {
      label: "Finished at",
      value: run.finishedAt
        ? dayjs.unix(run.finishedAt.seconds).format("D MMM YYYY h:mma")
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
