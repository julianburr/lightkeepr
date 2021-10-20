import { useRouter } from "next/router";
import { useForm } from "react-cool-form";
import {
  getFirestore,
  doc,
  collection,
  addDoc,
  updateDoc,
} from "firebase/firestore";

import { useAuthUser } from "src/hooks/use-auth-user";
import { api } from "src/utils/api-client";
import { Field } from "src/components/form/field";
import { TextInput } from "src/components/text-input";

const db = getFirestore();

export default function CreateOrganisationScreen() {
  const router = useRouter();
  const authUser = useAuthUser();

  const { form, use } = useForm<{ name?: string }>({
    defaultValues: {},
    onSubmit: async (values) => {
      // Create org
      const org = await addDoc(collection(db, "organisations"), {
        name: values.name,
        plan: "free",
        status: "active",
        billingEmail: authUser.email,
      });

      // Add user to org
      await addDoc(collection(db, "organisationUsers"), {
        organisation: doc(db, "organisations", org.id),
        user: doc(db, "users", authUser.email),
        role: "owner",
        status: "active",
      });

      // Create stripe customer
      const stripeCustomer = await api.post("/api/stripe/customers/create", {
        email: authUser.email,
        name: values.name,
      });
      await updateDoc(doc(db, "organisations", org.id), {
        stripeCustomerId: stripeCustomer.data?.id,
      });

      router.push(`/${org.id}/`);
    },
  });

  const isSubmitting = use("isSubmitting");

  return (
    <>
      <h1>Create new organisation</h1>
      <p>
        Enter the name of your new organisation to get things set up. Please
        keep in mind that projects are not shared between organisations.
      </p>

      <form ref={form}>
        <Field Input={TextInput} name="name" />
        <button disabled={isSubmitting}>Submit</button>
      </form>
    </>
  );
}
