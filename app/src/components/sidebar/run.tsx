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

import ArrowLeftSvg from "src/assets/icons/arrow-left.svg";

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

  return <Menu items={items} />;
}
