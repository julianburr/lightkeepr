import "src/utils/firebase";

import {
  getFirestore,
  doc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useMemo, Dispatch, SetStateAction } from "react";

import { useAuth, useCollection, useDocument } from "src/@packages/firebase";

const db = getFirestore();

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

type Notification = {
  id: string;
  type: string;
  title: string;
  description: string;
  href?: string;
  record?: any;
  references?: any[];
  seenAt?: any;
  createdAt: any;
};

type User = {
  id: string;
  email: string;
  name: string;
  subscriptions?: any[];
  notifications?: {
    [teamId: string]: Notification[];
  };
};

type Team = {
  id: string;
  name: string;
  billingEmail?: string;
  stripeCustomerId?: string;
  apiKey?: string;
  users?: any[];
  userRoles?: any;
};

type TeamRole = "owner" | "billing" | "member";

type Invite = {
  status: "pending" | "declined";
  createdAt: any;
  createdBy: any;
  sentAt?: any;
  declinedAt?: any;
};

type UseAuthUserResponse = FirebaseUser & {
  user?: User;
  teams?: Team[];
  team?: Team;
  teamRoles?: { [teamId: string]: TeamRole };
  teamRole?: TeamRole;
  pendingInvites?: (Invite & { team: Team })[];
  setAuthUser: Dispatch<SetStateAction<FirebaseUser>>;
};

export function useAuthUser(): UseAuthUserResponse {
  const authUser = useAuth();
  const router = useRouter();

  const userRef = authUser?.uid ? doc(db, "users", authUser.uid) : undefined;
  const user = useDocument(userRef, { throw: false });

  // Get all teams the user is a member of
  const teamsQuery = authUser?.uid
    ? query(
        collection(db, "teams"),
        where("users", "array-contains", authUser?.uid)
      )
    : undefined;
  const teams: any[] = useCollection(teamsQuery, {
    key: `${authUser?.uid}/teams`,
  });

  // Get invites that include the users email address
  const inviteQuery = authUser?.email
    ? query(
        collection(db, "teams"),
        where("invites", "array-contains", authUser?.email)
      )
    : undefined;
  const invites: any[] = useCollection(inviteQuery, {
    key: `${authUser?.uid}/pendingInvites`,
  });

  return useMemo(() => {
    // Get current team
    const team = teams?.find((team: any) => team.id === router.query.teamId);

    // Get all roles for the teams the user is a member of
    const teamRoles =
      teams?.reduce?.((all, team) => {
        all[team.id] = team.userRoles?.[authUser?.uid];
        return all;
      }, {}) || {};
    const teamRole = team?.id ? teamRoles[team.id] : undefined;

    // Prepare pending invites
    const pendingInvites = invites
      ?.map?.((team) => ({
        ...(team.inviteStatus[authUser?.email] || {}),
        team,
      }))
      ?.filter((invite) => invite.status === "pending");

    return {
      ...authUser,
      user,

      teams,
      team,
      teamRoles,
      teamRole,

      pendingInvites,
    };
  }, [user, teams, invites]);
}
