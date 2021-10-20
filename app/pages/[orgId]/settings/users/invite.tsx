import {
  getFirestore,
  addDoc,
  getDoc,
  setDoc,
  doc,
  collection,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useForm } from "react-cool-form";

import { Field } from "src/components/form/field";
import { Select } from "src/components/select";
import { EmailInput } from "src/components/text-input";

const db = getFirestore();

export default function InviteUserScreen() {
  const router = useRouter();
  const { orgId } = router.query;

  const { form, use } = useForm<{ role: string; email?: string }>({
    defaultValues: { role: "member" },
    onSubmit: async (values) => {
      const userRef = doc(db, "users", values.email);
      const user = await getDoc(userRef);
      if (!user?.exists?.()) {
        await setDoc(doc(db, "users", values.email), { email: values.email });
      }

      await addDoc(collection(db, "organisationUsers"), {
        user: userRef,
        organisation: doc(db, "organisations", orgId),
        status: "invited",
        role: "member",
      });

      // TODO: send email

      router.push(`/${orgId}/settings/organisation`);
    },
  });

  const isSubmitting = use("isSubmitting");

  return (
    <>
      <h1>Invite User</h1>
      <form ref={form}>
        <Field
          name="email"
          label="Email address"
          placeholder="Enter email adress of user you want to invite"
          Input={EmailInput}
          required
        />
        <Field
          name="role"
          label="Role"
          Input={Select}
          options={[
            { value: "member", label: "Member" },
            { value: "admin", label: "Admin" },
          ]}
          required
        />
        <button disabled={isSubmitting} type="submit">
          Invite
        </button>
      </form>
    </>
  );
}
