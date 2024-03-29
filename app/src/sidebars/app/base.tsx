import "src/utils/firebase";

import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { useCollection } from "src/@packages/firebase";
import { Badge } from "src/components/badge";
import { Menu } from "src/components/menu";
import { AppSwitcherDialog } from "src/dialogs/app-switcher";
import { useAuthUser } from "src/hooks/use-auth-user";
import { useDialog } from "src/hooks/use-dialog";

import BellSvg from "src/assets/icons/outline/bell.svg";
import LifeBuoySvg from "src/assets/icons/outline/support.svg";
import GridSvg from "src/assets/icons/outline/view-grid.svg";

const auth = getAuth();
const db = getFirestore();

type BaseSidebarProps = {
  getLinkProps: (state: any) => any;
};

export function BaseSidebar({ getLinkProps }: BaseSidebarProps) {
  const authUser = useAuthUser();
  const router = useRouter();

  const appSwitcherDialog = useDialog(AppSwitcherDialog);

  const teamRef = doc(db, "teams", router.query.teamId!);
  const projects = useCollection(
    query(
      collection(db, "projects"),
      where("team", "==", teamRef),
      orderBy("name", "asc")
    ),
    { key: `${router.query.teamId}/projects` }
  );

  const unseen = useMemo(
    () =>
      authUser.user?.notifications?.[router.query.teamId!]?.filter(
        (notification) => !notification.seenAt
      ),
    [authUser.user?.notifications, authUser.team?.id]
  );

  const items = [
    {
      mobile: true,
      label: "App switcher",
      icon: <GridSvg />,
      onClick: () => appSwitcherDialog.open(),
    },
    {
      mobile: true,
      label: "Notifications",
      icon: <BellSvg />,
      badge: <Badge count={unseen?.length} />,
      href: `/app/${router.query.teamId}/account/notifications`,
    },
    {
      mobile: true,
      label: "Documentation",
      icon: <LifeBuoySvg />,
      href: `/docs`,
      target: "_blank",
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
          label: "Subscription & billing",
          href: `/app/${router.query.teamId}/billing`,
        },
        {
          label: "Settings",
          href: `/app/${router.query.teamId}/settings`,
        },
      ],
    },

    // Projects list
    ...(projects.length
      ? [
          {
            label: "Projects",
            items: projects.map((project: any) => ({
              label: project.name,
              ...getLinkProps({ projectId: project.id }),
            })),
          },
        ]
      : []),

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
