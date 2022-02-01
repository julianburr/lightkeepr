import "src/utils/firebase";

import { useRouter } from "next/router";
import SignIn from "pages/auth/sign-in";
import { PropsWithChildren, useEffect } from "react";

import { useAuthUser } from "src/hooks/use-auth-user";
import { usePersistedState } from "src/hooks/use-persisted-state";

type AuthProps = PropsWithChildren<Record<never, any>>;

export function Auth({ children }: AuthProps) {
  const router = useRouter();
  const authUser = useAuthUser();

  const [lastTeamId, setLastTeamId] = usePersistedState(
    "@lightkeepr/lastTeamId",
    authUser.teams?.[0]?.id
  );

  useEffect(() => {
    if (router.query.teamId && authUser.teams?.length) {
      const isValid = authUser.teams.find(
        (team: any) => team.id === router.query.teamId
      );
      if (!isValid) {
        // Force user back to save waters if they try to access a team
        // they are not a part of
        setLastTeamId(authUser.teams[0].id);
        router.replace(`/app/${authUser.teams[0].id}`);
      } else {
        setLastTeamId(router.query.teamId);
      }
    }
  }, [router.query.teamId]);

  if (!authUser.uid) {
    // No user, show sign in form without redirecting, so in an ideal flow
    // the user logs in and still lands on the URL they wanted to go to
    return <SignIn />;
  }

  if (
    !authUser.email ||
    (!authUser.emailVerified &&
      authUser.providerData?.[0]?.providerId === "password")
  ) {
    // Email has not been verified yet - for now we don't allow users to enter
    // the app before they verified their email
    if (router.route !== "/app/setup/email-verification") {
      router.replace("/app/setup/email-verification");
      return null;
    }
    return <>{children}</>;
  }

  if (!authUser.user?.name) {
    // User profile hasn't been set up yet
    if (router.route !== "/app/setup/user") {
      router.replace("/app/setup/user");
      return null;
    }
    return <>{children}</>;
  }

  if (authUser.pendingInvites?.length) {
    // User has pending invites, so we show them instead of the app so the
    // user can easily accept or decline them
    if (router.route !== "/app/setup/pending-invites") {
      router.replace("/app/setup/pending-invites");
      return null;
    }
    return <>{children}</>;
  }

  if (!authUser.teams?.length) {
    if (router.route !== "/app/setup/team") {
      router.replace("/app/setup/team");
      return null;
    }
    return <>{children}</>;
  }

  if (
    router.route.startsWith("/app/setup/") ||
    ["/", "/app"].includes(router.route)
  ) {
    router.replace(`/app/${lastTeamId}`);
    return null;
  }

  return <>{children}</>;
}
