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

const db = getFirestore();

export function useAuthUser() {
  const authUser = useAuth();
  const router = useRouter();

  const userRef = authUser?.email
    ? doc(db, "users", authUser.email)
    : undefined;

  const user = useDocument(userRef);
  const organisationUsers = useCollection(
    userRef
      ? query(collection(db, "organisationUsers"), where("user", "==", userRef))
      : undefined,
    { key: "organisationUsers" }
  );

  const organisationUser = organisationUsers?.find?.(
    (u: any) => u.id === router.query.orgUserId
  );

  return useMemo(
    () => ({ ...authUser, user, organisationUser, organisationUsers }),
    [authUser, user, organisationUser, organisationUsers]
  );
}
