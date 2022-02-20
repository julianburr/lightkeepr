import { useRouter } from "next/router";

import { api } from "src/utils/api-client";

import { useAuthUser } from "./use-auth-user";

export function useApi(options = {}) {
  const router = useRouter();
  const authUser = useAuthUser();

  api.setOptions(options);

  if (router.query.teamId) {
    api.setHeader("X-Lightkeepr-Team", router.query.teamId);
  }

  if (authUser.accessToken) {
    api.setToken(authUser.accessToken);
  }

  return api;
}
