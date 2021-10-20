import { useEffect } from "react";
import {
  getFirestore,
  doc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";

import { useCollection, useDocument } from "src/@packages/firebase";

const db = getFirestore();

export default function HomeScreen({ authUser }) {
  const router = useRouter();

  const userRef = doc(db, "users", authUser.email);
  const orgUsers = useCollection(
    query(collection(db, "organisationUsers"), where("user", "==", userRef)),
    { key: "orgUsers" }
  );

  console.log({ orgUsers });

  const orgId = orgUsers?.[0]?.organisation?.id;
  if (orgId) {
    router.push(`/${orgId}`);
  }

  return null;
}
