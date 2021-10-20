import { useMemo } from "react";
import {
  getFirestore,
  doc,
  collection,
  query,
  where,
} from "firebase/firestore";

import { useAuth, useCollection, useDocument } from "../@packages/firebase";

const db = getFirestore();

export function useAuthUser() {
  const authUser = useAuth();

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

  return useMemo(
    () => ({ ...authUser, user, organisationUsers }),
    [authUser, user, organisationUsers]
  );
}
