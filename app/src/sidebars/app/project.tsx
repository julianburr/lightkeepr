import "src/utils/firebase";

import { doc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";

import { useDocument } from "src/@packages/firebase";
import { Menu } from "src/components/menu";

import ArrowLeftSvg from "src/assets/icons/outline/arrow-left.svg";

const db = getFirestore();

type ProjectSidebarProps = {
  projectId: string;
  getLinkProps: (state?: any) => any;
};

export function ProjectSidebar({
  projectId,
  getLinkProps,
}: ProjectSidebarProps) {
  const router = useRouter();
  const project = useDocument(doc(db, "projects", projectId));

  const items = [
    {
      icon: <ArrowLeftSvg />,
      label: "Back to team overview",
      isBacklink: true,
      ...getLinkProps(),
    },

    {
      label: project.name,
      items: [
        {
          label: "Runs",
          href: `/app/${router.query.teamId}/projects/${projectId}`,
        },
        {
          label: "Integrations",
          href: `/app/${router.query.teamId}/projects/${projectId}/integrations`,
        },
        {
          label: "Settings",
          href: `/app/${router.query.teamId}/projects/${projectId}/settings`,
        },
      ],
    },
  ];

  return <Menu items={items} />;
}
