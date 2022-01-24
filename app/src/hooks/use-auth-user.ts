import "src/utils/firebase";

import { useMemo } from "react";
import {
  getFirestore,
  doc,
  collection,
  query,
  where,
} from "firebase/firestore";

import { useAuth, useCollection, useDocument } from "../@packages/firebase";
import { useRouter } from "next/router";
import { api } from "src/utils/api-client";
import { useErrorDialog } from "./use-dialog";
import { Dispatch } from "react";
import { SetStateAction } from "react";

const db = getFirestore();

type User = {
  id: string;
  name: string;
};

type Team = {
  id: string;
  name: string;
  billingEmail?: string;
  stripeCustomerId?: string;
};

type TeamUser = {
  id: string;
  team: { id: string };
  user: { id: string };
  status: string;
  role: string;
};

type ProviderData = {
  providerId: string;
};

type FirebaseUser = {
  uid?: string;
  email?: string;
  emailVerified?: boolean;
  displayName?: string;
  providerData?: ProviderData[];
};

type UseAuthUserResponse = FirebaseUser & {
  user?: User;
  teams?: Team[];
  teamUsers?: TeamUser[];
  team?: Team;
  teamUser?: TeamUser;
  pendingInvites?: TeamUser[];
  setAuthUser: Dispatch<SetStateAction<FirebaseUser>>;
};

export function useAuthUser(): UseAuthUserResponse {
  const authUser = useAuth();
  const router = useRouter();

  const userRef = authUser?.email
    ? doc(db, "users", authUser.email)
    : undefined;
  const user = useDocument(userRef);

  const teams = useCollection(collection(db, "teams"), {
    key: `${authUser?.email}/teams`,
  });

  const teamUsers = useCollection(
    userRef
      ? query(collection(db, "teamUsers"), where("user", "==", userRef))
      : undefined,
    { key: `${authUser?.email}/teamUsers` }
  );

  return useMemo(() => {
    const activeTeamUsers = teamUsers?.filter?.(
      (u: any) => u.status === "active"
    );

    return {
      ...authUser,
      user,

      teamUsers: activeTeamUsers,
      teams: teams?.filter?.((team: any) =>
        activeTeamUsers?.find?.((user: any) => user.team.id === team.id)
      ),

      teamUser: activeTeamUsers?.find?.(
        (user: any) => user.team.id === router.query.teamId
      ),
      team: teams?.find?.((team: any) => team.id === router.query.teamId),

      pendingInvites: teamUsers?.filter?.((u: any) => u.status === "pending"),
    };
  }, [authUser, user, teamUsers, teams, router.query.teamId]);
}
