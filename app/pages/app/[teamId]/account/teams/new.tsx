import "src/utils/firebase";

import { useForm } from "react-cool-form";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import styled from "styled-components";

import { useAuthUser } from "src/hooks/use-auth-user";
import { AppLayout } from "src/layouts/app";
import { Auth } from "src/components/auth";
import { Button } from "src/components/button";
import { Field } from "src/components/field";
import { Form } from "src/components/form";
import { EmailInput, TextInput } from "src/components/text-input";
import { Spacer } from "src/components/spacer";
import { ButtonBar } from "src/components/button-bar";
import { api } from "src/utils/api-client";
import { generateApiKey } from "src/utils/api-key";

const db = getFirestore();

const Container = styled.div`
  width: 100%;
  max-width: 45rem;
`;

export default function NewTeam() {
  const router = useRouter();
  const authUser = useAuthUser();

  const { form, use } = useForm({
    defaultValues: { name: "", billingEmail: authUser.user?.id },
    onSubmit: async (values) => {
      const userRef = doc(db, "users", authUser.user!.id);
      const team = await addDoc(collection(db, "teams"), {
        name: values.name,
        billingEmail: values.billingEmail,
        plan: "free",
        apiKey: generateApiKey(),
        createdAt: new Date(),
        createdBy: userRef,
      });

      const teamRef = doc(db, "teams", team.id!);
      await addDoc(collection(db, "teamUsers"), {
        team: teamRef,
        user: userRef,
        role: "owner",
        status: "active",
        createdAt: new Date(),
        createdBy: userRef,
      });

      const stripeCustomer = await api.post("/api/stripe/customers/create", {
        email: values.billingEmail,
        name: values.name,
        teamId: team.id,
      });
      await updateDoc(doc(db, "teams", team.id), {
        stripeCustomerId: stripeCustomer.data?.id,
      });

      router.push(`/app/${team.id}`);
    },
  });

  return (
    <Auth>
      <AppLayout>
        <Container>
          <h1>Create a new team</h1>
          <Spacer h="1.6rem" />

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
                  type="submit"
                  intent="primary"
                  disabled={use("isSubmitting")}
                >
                  Create team
                </Button>
              }
            />
          </Form>
        </Container>
      </AppLayout>
    </Auth>
  );
}
