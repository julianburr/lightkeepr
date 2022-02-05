import "src/utils/firebase";

import { doc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";

import { useDocument } from "src/@packages/firebase";
import { Menu } from "src/components/menu";

import ArrowLeftSvg from "src/assets/icons/outline/arrow-left.svg";

const db = getFirestore();

type CompareSidebarProps = {
  reportIds: string;
  getLinkProps?: (state: any) => any;
};

export function CompareSidebar({
  reportIds,
  getLinkProps,
}: CompareSidebarProps) {
  const router = useRouter();

  const [reportId] = reportIds.split("..");
  const report = useDocument(doc(db, "reports", reportId));

  const items = [
    {
      icon: <ArrowLeftSvg />,
      label: "Back to project overview",
      isBacklink: true,
      ...(getLinkProps?.({ runId: report.project.id }) || {}),
    },

    // Report tabs
    {
      label: "Compare",
      items: [
        {
          label: "Overview",
          href: `/app/${router.query.teamId}/compare/${reportIds}`,
        },
        {
          label: "Performance",
          href: `/app/${router.query.teamId}/compare/${reportIds}?category=performance`,
        },
        {
          label: "Accessibility",
          href: `/app/${router.query.teamId}/compare/${reportIds}?category=accessibility`,
        },
        {
          label: "Best practices",
          href: `/app/${router.query.teamId}/compare/${reportIds}?category=best-practices`,
        },
        {
          label: "SEO",
          href: `/app/${router.query.teamId}/compare/${reportIds}?category=seo`,
        },
        {
          label: "PWA",
          href: `/app/${router.query.teamId}/compare/${reportIds}?category=pwa`,
        },
      ],
    },
  ];

  return <Menu items={items} />;
}
