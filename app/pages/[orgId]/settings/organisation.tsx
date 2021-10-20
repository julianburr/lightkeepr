import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-cool-form";
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  query,
  collection,
  where,
} from "firebase/firestore";

import { useCollection, useDocument } from "src/@packages/firebase";
import { useAuthUser } from "src/hooks/use-auth-user";
import { Field } from "src/components/form/field";
import { TextInput } from "src/components/text-input";
import { List, ListItem } from "src/components/list";

const db = getFirestore();

export default function OrganisationSettingsScreen() {
  const authUser = useAuthUser();

  const router = useRouter();
  const { orgId } = router.query;

  const orgRef = doc(db, "organisations", orgId);
  const org = useDocument(orgRef);

  const { form, use } = useForm({
    defaultValues: org,
    onSubmit: async (values) => {
      await setDoc(
        orgRef,
        { name: values.name, billingEmail: values.billingEmail },
        { merge: true }
      );
    },
  });

  const isSubmitting = use("isSubmitting");

  const organisationUsers = useCollection(
    query(
      collection(db, "organisationUsers"),
      where("organisation", "==", orgRef)
    ),
    { key: "organisationSettings--users" }
  );

  return (
    <>
      <h1>Organisation Settings</h1>

      <h2>Details</h2>
      <form ref={form}>
        <Field
          name="name"
          label="Organisation name"
          Input={TextInput}
          required
        />
        <Field
          name="billingEmail"
          label="Billing email"
          Input={TextInput}
          required
        />
        <button disabled={isSubmitting} type="submit">
          Update
        </button>
      </form>

      <h2>Users</h2>
      <Link href={`/${orgId}/settings/users/invite`}>
        <a>Invite user</a>
      </Link>

      <List
        items={organisationUsers}
        Item={({ item }) => (
          <ListItem
            title={item.user.id}
            status={
              <button
                onClick={async () => {
                  await deleteDoc(doc(db, "organisationUsers", item.id));
                }}
                disabled={authUser.email === item.user.id}
              >
                Remove
              </button>
            }
          />
        )}
      />
    </>
  );
}
