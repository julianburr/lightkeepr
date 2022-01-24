import "src/utils/firebase";

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
import { Spacer } from "src/components/spacer";
import { ButtonBar } from "src/components/button-bar";

const db = getFirestore();

export default function TeamSetup() {
  const authUser = useAuthUser();

  const { form, use } = useForm({
    defaultValues: { name: "", billingEmail: authUser.email },
    onSubmit: async (values) => {
      // Create team
      const team = await addDoc(collection(db, "teams"), {
        name: values.name,
        billingEmail: values.billingEmail,
        plan: "free",
      });

      // Create organisation user
      await addDoc(collection(db, "teamUsers"), {
        user: doc(db, "users", authUser.email!),
        team: doc(db, "teams", team.id),
        role: "owner",
        status: "active",
      });

      // Create stripe customer
      const stripeCustomer = await api.post("/api/stripe/customers/create", {
        email: values.billingEmail,
        name: values.name,
        teamId: team.id,
      });
      await updateDoc(doc(db, "teams", team.id), {
        stripeCustomerId: stripeCustomer.data?.id,
      });
    },
  });

  return (
    <Auth>
      <SetupLayout>
        <h1>Almost done! You'll need to create a team to get started.</h1>
        <Spacer height="1.6rem" />

        <Form ref={form}>
          <Field name="name" label="Team name" Input={TextInput} required />
          <Field
            name="billingEmail"
            label="Billing email"
            Input={EmailInput}
            required
          />
          <ButtonBar
            left={
              <Button
                intend="primary"
                type="submit"
                disabled={use("isSubmitting")}
              >
                Create team
              </Button>
            }
          />
        </Form>
      </SetupLayout>
    </Auth>
  );
}
