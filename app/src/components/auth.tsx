import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/router";

import { useAuthUser } from "src/hooks/use-auth-user";
import { usePersistedState } from "src/hooks/use-persisted-state";

import SignIn from "pages/sign-in";

type AuthProps = PropsWithChildren<Record<never, any>>;

export function Auth({ children }: AuthProps) {
  const router = useRouter();
  const authUser = useAuthUser();

  const [lastOrgUserId, setLastOrgUserId] = usePersistedState(
    "@lightkeepr/lastOrgUserId",
    authUser.organisationUsers?.[0]?.id
  );

  useEffect(() => {
    if (router.query?.orgUserId && authUser.organisationUsers?.length) {
      const isValid = authUser.organisationUsers.find(
        (orgUser: any) => orgUser.id === router.query?.orgUserId
      );
      if (!isValid) {
        setLastOrgUserId(authUser.organisationUsers[0].id);
        router.replace(`/app/${authUser.organisationUsers[0].id}`);
      }
    }
  }, [router.query?.orgUserId]);

  if (!authUser.uid) {
    return <SignIn />;
  }

  if (!authUser.user) {
    if (router.asPath !== "/app/setup/user") {
      router.replace("/app/setup/user");
      return null;
    }
    return <>{children}</>;
  }

  if (!authUser.organisationUsers?.length) {
    if (router.asPath !== "/app/setup/organisation") {
      router.replace("/app/setup/organisation");
      return null;
    }
    return <>{children}</>;
  }

  if (
    router.asPath.startsWith("/app/setup/") ||
    ["/", "/app"].includes(router.asPath)
  ) {
    router.replace(`/app/${lastOrgUserId}`);
    return null;
  }

  return <>{children}</>;
}
