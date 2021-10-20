import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getFirestore, collection, query } from "firebase/firestore";

import { useAuthUser } from "../hooks/use-auth-user";
import { useCollection } from "../@packages/firebase";

const db = getFirestore();

export function OrganisationSelect() {
  const router = useRouter();
  const authUser = useAuthUser();

  const organisations = useCollection(query(collection(db, "organisations")), {
    key: "organisations",
  });

  const userOrganisations = authUser.organisationUsers.map((orgUser) =>
    organisations.find((org) => org.id === orgUser.organisation.id)
  );
  userOrganisations.sort((a, b) => (a > b ? 1 : -1));

  return (
    <select
      value={router.query?.orgId}
      onChange={(e) => {
        if (e.target.value === "new") {
          router.push(`/${router.query?.orgId}/create-organisation`);
        } else {
          router.push(`/${e.target.value}/`);
        }
      }}
    >
      {userOrganisations.map((organisation) => (
        <option value={organisation.id} key={organisation.id}>
          {organisation.name}
        </option>
      ))}
      <option value="new">+ Create new organisation</option>
    </select>
  );
}
