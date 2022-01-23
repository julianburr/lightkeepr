import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/router";

import { useAuthUser } from "src/hooks/use-auth-user";
import { usePersistedState } from "src/hooks/use-persisted-state";

import SignIn from "pages/sign-in";

type AuthProps = PropsWithChildren<Record<never, any>>;

export function Auth({ children }: AuthProps) {
  const router = useRouter();
  const authUser = useAuthUser();

  const [lastTeamId, setLastTeamId] = usePersistedState(
    "@lightkeepr/lastTeamId",
    authUser.teams?.[0]
  );

  useEffect(() => {
    if (router.query.teamId && authUser.teams?.length) {
      const isValid = authUser.teams.find(
        (team: any) => team.id === router.query.teamId
      );
      if (!isValid) {
        setLastTeamId(authUser.teams[0].id);
        router.replace(`/app/${authUser.teams[0].id}`);
      }
    }
  }, [router.query.teamId]);

  if (!authUser.uid) {
    return <SignIn />;
  }

  if (
    !authUser.email ||
    (!authUser.emailVerified &&
      authUser.providerData?.[0]?.providerId === "password")
  ) {
    if (router.route !== "/app/setup/email-verification") {
      router.replace("/app/setup/email-verification");
      return null;
    }
    return <>{children}</>;
  }

  if (!authUser.user) {
    if (router.route !== "/app/setup/user") {
      router.replace("/app/setup/user");
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

  if (authUser.pendingInvites?.length) {
    if (router.route !== "/app/setup/pending-invites") {
      router.replace("/app/setup/pending-invites");
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
