import "src/utils/firebase";

import {
  addDoc,
  collection,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { useForm } from "react-cool-form";

import { Auth } from "src/components/auth";
import { Button } from "src/components/button";
import { ButtonBar } from "src/components/button-bar";
import { Field } from "src/components/field";
import { FormGrid } from "src/components/form-grid";
import { Spacer } from "src/components/spacer";
import { EmailInput, TextInput } from "src/components/text-input";
import { useAuthUser } from "src/hooks/use-auth-user";
import { SetupLayout } from "src/layouts/setup";
import { api } from "src/utils/api-client";

const db = getFirestore();

export default function TeamSetup() {
  const authUser = useAuthUser();
  const userId = authUser.user?.id;

  const { form, use } = useForm({
    defaultValues: { name: "", billingEmail: authUser.email },
    onSubmit: async (values) => {
      // Create team
      const team = await addDoc(collection(db, "teams"), {
        name: values.name,
        billingEmail: values.billingEmail,
        plan: "free",
        createdAt: new Date(),
        createdBy: doc(db, "users", userId!),
        users: [authUser.uid],
        userRoles: {
          [authUser.uid!]: "owner",
        },
      });

      // Create stripe customer
      const stripeCustomer = await api.post("/api/stripe/customers/create", {
        email: values.billingEmail,
        name: values.name,
        teamId: team.id,
      });

      // Add new stripe customer id to the team
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

        <form ref={form}>
          <FormGrid>
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
                  intent="primary"
                  type="submit"
                  disabled={use("isSubmitting")}
                >
                  Create team
                </Button>
              }
            />
          </FormGrid>
        </form>
      </SetupLayout>
    </Auth>
  );
}
