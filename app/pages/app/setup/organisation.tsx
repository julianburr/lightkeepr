import { useForm } from "react-cool-form";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";

import { api } from "src/utils/api-client";
import { useAuthUser } from "src/hooks/use-auth-user";
import { SetupLayout } from "src/layouts/setup";
import { Auth } from "src/components/auth";
import { Field } from "src/components/field";
import { EmailInput, TextInput } from "src/components/text-input";
import { Button } from "src/components/button";
import { Form } from "src/components/form";

const db = getFirestore();

export default function OrganisationSetup() {
  const authUser = useAuthUser();

  console.log({ authUser });

  const { form, use } = useForm({
    defaultValues: { name: "", billingEmail: authUser.email },
    onSubmit: async (values) => {
      // Create organisation
      const org = await addDoc(collection(db, "organisations"), {
        name: values.name,
        billingEmail: authUser.email,
        plan: "free",
      });

      // Create organisation user
      await addDoc(collection(db, "organisationUsers"), {
        user: doc(db, "users", authUser.email),
        organisation: doc(db, "organisations", org.id),
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

  return (
    <Auth>
      <SetupLayout>
        <h1>
          Almost done! You'll need to create an organisation to get started.
        </h1>

        <Form ref={form}>
          <Field
            name="name"
            label="Organisation name"
            Input={TextInput}
            required
          />
          <Field
            name="billingEmail"
            label="Billing email"
            Input={EmailInput}
            required
          />
          <Button intend="primary" type="submit" disabled={use("isSubmitting")}>
            Create organisation
          </Button>
        </Form>
      </SetupLayout>
    </Auth>
  );
}
