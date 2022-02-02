import "src/utils/firebase";

import { useRouter } from "next/router";
import SignIn from "pages/auth/sign-in";
import { PropsWithChildren, useEffect } from "react";

import { useSuspense } from "src/@packages/suspense";
import { useAuthUser } from "src/hooks/use-auth-user";
import { usePersistedState } from "src/hooks/use-persisted-state";
import { useToast } from "src/hooks/use-toast";
import { api } from "src/utils/api-client";

type AuthProps = PropsWithChildren<Record<never, any>>;

export function Auth({ children }: AuthProps) {
  const router = useRouter();
  const authUser = useAuthUser();

  const toast = useToast();

  // Verify email address if `vid` query is in current url
  useSuspense(
    () =>
      api
        .post("/api/account/verify-email", {
          userUid: authUser.uid,
          email: authUser.email,
          vid: router.query.vid,
        })
        .then((res) => {
          console.log({ res });
          authUser.setAuthUser(res.data);
          router.replace(router.pathname);
          toast.show({ message: "Email address has been verified" });
        })
        .catch((e) => {
          console.error(e);
          router.replace(router.pathname);
          toast.show({ message: "Email address could not be verified" });
        }),
    {
      key: `${authUser.uid}/verify-email`,
      fetch: !!authUser.uid && !!router.query.vid,
    }
  );

  console.log({ authUser });

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

  if (!authUser.user?.name) {
    // User profile hasn't been set up yet
    if (router.route !== "/app/setup/user") {
      router.replace({
        pathname: "/app/setup/user",
        query: router.query.plan ? { plan: router.query.plan } : {},
      });
      return null;
    }
    return <>{children}</>;
  }

  if (authUser.pendingInvites?.length) {
    // User has pending invites, so we show them instead of the app so the
    // user can easily accept or decline them
    if (router.route !== "/app/setup/pending-invites") {
      router.replace({
        pathname: "/app/setup/pending-invites",
        query: router.query.plan ? { plan: router.query.plan } : {},
      });
      return null;
    }
    return <>{children}</>;
  }

  if (!authUser.teams?.length) {
    if (router.route !== "/app/setup/team") {
      router.replace({
        pathname: "/app/setup/team",
        query: router.query.plan ? { plan: router.query.plan } : {},
      });
      return null;
    }
    return <>{children}</>;
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

  if (
    router.route.startsWith("/app/setup/") ||
    ["/", "/app"].includes(router.route)
  ) {
    router.replace(`/app/${lastTeamId}`);
    return null;
  }

  return <>{children}</>;
}
