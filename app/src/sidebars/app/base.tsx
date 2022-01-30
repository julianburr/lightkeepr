import "src/utils/firebase";

import { useRouter } from "next/router";
import { useCollection } from "src/@packages/firebase";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { Menu } from "src/components/menu";

import BellSvg from "src/assets/icons/bell.svg";
import GridSvg from "src/assets/icons/grid.svg";
import LifeBuoySvg from "src/assets/icons/life-buoy.svg";

const auth = getAuth();
const db = getFirestore();

type BaseSidebarProps = {
  getLinkProps: (state: any) => any;
};

export function BaseSidebar({ getLinkProps }: BaseSidebarProps) {
  const router = useRouter();

  const teamRef = doc(db, "teams", router.query.teamId!);
  const projects = useCollection(
    query(
      collection(db, "projects"),
      where("team", "==", teamRef),
      orderBy("name", "asc")
    ),
    { key: `${router.query.teamId}/projects` }
  );

  const items = [
    {
      mobile: true,
      label: "App switcher",
      icon: <GridSvg />,
      onClick: () => alert("Hi!"),
    },
    {
      mobile: true,
      label: "Notifications",
      icon: <BellSvg />,
      href: `/app/${router.query.teamId}/account/notifications`,
    },
    {
      mobile: true,
      label: "Documentation",
      icon: <LifeBuoySvg />,
      href: `/docs`,
    },

    // Projects list
    {
      label: "Projects",
      items: projects.map((project: any) => ({
        label: project.name,
        ...getLinkProps({ projectId: project.id }),
      })),
    },

    // Team menu items
    {
      label: "Team",
      items: [
        {
          label: "Overview",
          href: `/app/${router.query.teamId}`,
        },
        {
          label: "Users",
          href: `/app/${router.query.teamId}/users`,
        },
        {
          label: "Billing & usage",
          href: `/app/${router.query.teamId}/billing`,
        },
        {
          label: "Settings",
          href: `/app/${router.query.teamId}/settings`,
        },
      ],
    },

    // Profile menu items
    {
      mobile: true,
      label: "Account",
      items: [
        {
          label: "Create a new team",
          href: `/app/${router.query.teamId}/account/teams/new`,
        },
        {
          label: "Profile settings",
          href: `/app/${router.query.teamId}/account/settings`,
        },
        {
          label: "Sign out",
          onClick: () => auth.signOut(),
        },
      ],
    },
  ];

  return <Menu items={items} />;
}
