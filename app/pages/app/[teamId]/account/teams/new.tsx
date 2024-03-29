import "src/utils/firebase";

import {
  addDoc,
  collection,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useForm } from "react-cool-form";
import styled from "styled-components";

import { Auth } from "src/components/auth";
import { Button } from "src/components/button";
import { ButtonBar } from "src/components/button-bar";
import { Field } from "src/components/field";
import { FormGrid } from "src/components/form-grid";
import { PlanSelectInput } from "src/components/plan-select-input";
import { Spacer } from "src/components/spacer";
import { EmailInput, TextInput } from "src/components/text-input";
import { env } from "src/env";
import { useApi } from "src/hooks/use-api";
import { useAuthUser } from "src/hooks/use-auth-user";
import { AppLayout } from "src/layouts/app";
import { event } from "src/utils/ga";
import { stripeClient } from "src/utils/stripe";

const db = getFirestore();

const Container = styled.div`
  width: 100%;
  max-width: 45rem;
`;

export default function NewTeam() {
  const router = useRouter();
  const authUser = useAuthUser();

  const api = useApi();

  const { form, use } = useForm({
    defaultValues: {
      name: "",
      billingEmail: authUser.user?.email,
      plan: "free",
    },
    onSubmit: async (values) => {
      const userRef = doc(db, "users", authUser.user!.id);
      const team = await addDoc(collection(db, "teams"), {
        name: values.name,
        billingEmail: values.billingEmail,
        plan: values.plan,
        createdAt: new Date(),
        createdBy: userRef,
        users: [authUser.uid],
        userRoles: {
          [authUser.uid!]: "owner",
        },
      });

      const stripeCustomer = await api.post("/api/stripe/customers/create", {
        teamId: team.id,
      });

      await updateDoc(doc(db, "teams", team.id), {
        stripeCustomerId: stripeCustomer.data?.id,
      });

      event({
        action: "team_created",
        params: { team },
      });

      if (values.plan === "premium") {
        const session: any = await api
          .post(
            `/api/stripe/customers/${stripeCustomer.data?.id}` +
              `/subscriptions/session`,
            {
              teamId: team.id,
              priceId: env.stripe.priceId.premium.monthly,
              redirectUrl: `/app/${team.id}`,
            }
          )
          .then(({ data }) => data);

        const stripe = await stripeClient();
        await stripe.redirectToCheckout({ sessionId: session?.id });
      } else {
        router.push(`/app/${team.id}`);
      }
    },
  });

  return (
    <Auth>
      <AppLayout>
        <Container>
          <h1>Create a new team</h1>
          <Spacer h="1.6rem" />

          <form ref={form}>
            <FormGrid>
              <Field name="name" label="Team name" Input={TextInput} required />
              <Field
                name="billingEmail"
                label="Billing email"
                Input={EmailInput}
                required
              />
              <Field
                name="plan"
                label="Plan"
                Input={PlanSelectInput}
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
            </FormGrid>
          </form>
        </Container>
      </AppLayout>
    </Auth>
  );
}
