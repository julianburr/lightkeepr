import "src/utils/firebase";

import { doc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";

import { useDocument } from "src/@packages/firebase";
import { Menu } from "src/components/menu";

import ArrowLeftSvg from "src/assets/icons/arrow-left.svg";

const db = getFirestore();

type ReportSidebarProps = {
  reportId: string;
};

export function ReportSidebar({ reportId }: ReportSidebarProps) {
  const router = useRouter();

  const report = useDocument(doc(db, "reports", reportId));

  const items = [
    {
      icon: <ArrowLeftSvg />,
      label: "Back to project overview",
      href: `/app/${router.query.teamId}/runs/${report.run.id}`,
      isBacklink: true,
    },
  ];

  return <Menu items={items} />;
}
