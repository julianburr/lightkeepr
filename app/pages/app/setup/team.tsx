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

import { Auth } from "src/components/auth";
import { Button } from "src/components/button";
import { ButtonBar } from "src/components/button-bar";
import { Field } from "src/components/field";
import { FormGrid } from "src/components/form-grid";
import { PlanSelectInput } from "src/components/plan-select-input";
import { Spacer } from "src/components/spacer";
import { EmailInput, TextInput } from "src/components/text-input";
import { env } from "src/env";
import { useAuthUser } from "src/hooks/use-auth-user";
import { SetupLayout } from "src/layouts/setup";
import { api } from "src/utils/api-client";
import { stripeClient } from "src/utils/stripe";

const db = getFirestore();

export default function TeamSetup() {
  const router = useRouter();

  const authUser = useAuthUser();
  const userId = authUser.user?.id;

  const { form, use } = useForm({
    defaultValues: {
      name: "",
      billingEmail: authUser.email,
      plan: router.query.plan || "free",
    },
    onSubmit: async (values) => {
      // Create team
      const team = await addDoc(collection(db, "teams"), {
        name: values.name,
        billingEmail: values.billingEmail,
        plan: values.plan,
        createdAt: new Date(),
        createdBy: doc(db, "users", userId!),
      });

      // Create stripe customer
      const stripeCustomer = await api.post("/api/stripe/customers/create", {
        email: values.billingEmail,
        name: values.name,
        teamId: team.id,
      });

      if (values.plan === "premium") {
        const session: any = await api
          .post(
            `/api/stripe/customers/${stripeCustomer.data?.id}` +
              `/subscriptions/session`,
            {
              teamId: team.id,
              priceId: env.stripe.priceId.premium.monthly,
              redirectUrl: window.location.pathname,
            }
          )
          .then(({ data }) => data);

        // HACK: Add new stripe customer id to the team - we do this after creating the
        // subscription session, because otherwise the screen would already jump to the
        // next setup screen (or dashboard) because the auth component just checks for
        // the existence of a team user :/
        await updateDoc(doc(db, "teams", team.id), {
          stripeCustomerId: stripeCustomer.data?.id,
          users: [authUser.uid],
          userRoles: {
            [authUser.uid!]: "owner",
          },
        });

        const stripe = await stripeClient();
        await stripe.redirectToCheckout({ sessionId: session?.id });
      } else {
        // Add new stripe customer id to the team
        await updateDoc(doc(db, "teams", team.id), {
          stripeCustomerId: stripeCustomer.data?.id,
          users: [authUser.uid],
          userRoles: {
            [authUser.uid!]: "owner",
          },
        });
      }
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
            <Field name="plan" label="Plan" Input={PlanSelectInput} required />
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
