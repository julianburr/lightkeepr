import { useForm } from "react-cool-form";
import {
  getFirestore,
  doc,
  collection,
  addDoc,
  updateDoc,
} from "firebase/firestore";

import { api } from "../../utils/api-client";
import { useAuthUser } from "../../hooks/use-auth-user";
import { Field } from "../../components/form/field";
import { TextInput } from "../../components/text-input";

const db = getFirestore();

export function OrganisationSetupScreen() {
  const authUser = useAuthUser();

  const { form, use } = useForm<{ name?: string; email?: string }>({
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
    },
  });

  const isSubmitting = use("isSubmitting");

  return (
    <>
      <h1>Set up your organisation</h1>
      <p>
        Looks like you haven’t set up your organisation yet. This will allow you
        to invite other people to your projects.
      </p>
      <p>
        If you are just using this account for personal projects, you can use
        your name as the organisation name.
      </p>

      <form ref={form}>
        <Field Input={TextInput} name="name" />
        <button disabled={isSubmitting}>Submit</button>
      </form>
    </>
  );
}
