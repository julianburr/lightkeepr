import "src/utils/firebase";

import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import styled from "styled-components";

import { Auth } from "src/components/auth";
import { Field } from "src/components/field";
import { FormGrid } from "src/components/form-grid";
import { ReadonlyInput } from "src/components/readonly-input";
import { Spacer } from "src/components/spacer";
import { Heading, P } from "src/components/text";
import { EmailInput, TextInput } from "src/components/text-input";
import { useAuthUser } from "src/hooks/use-auth-user";
import { useAutoSaveForm } from "src/hooks/use-auto-save-form";
import { useToast } from "src/hooks/use-toast";
import { AppLayout } from "src/layouts/app";
import { api } from "src/utils/api-client";

const db = getFirestore();

const Container = styled.div`
  width: 100%;
  max-width: 45rem;
`;

export default function TeamSettings() {
  const authUser = useAuthUser();
  const router = useRouter();
  const toast = useToast();

  const { form } = useAutoSaveForm({
    defaultValues: {
      name: authUser.team?.name || "",
      billingEmail: authUser.team?.billingEmail,
    },
    onSubmit: async (values) => {
      await updateDoc(doc(db, "teams", router.query.teamId!), {
        name: values.name,
        billingEmail: values.billingEmail,
      });

      const customerId = authUser.team?.stripeCustomerId;
      await api.post(`/api/stripe/customers/${customerId}/update`, {
        email: values.billingEmail,
        name: values.name,
      });
    },
  });

  if (authUser.teamRole !== "owner") {
    return (
      <Auth>
        <AppLayout>
          <Container>
            <Heading level={1}>Team settings</Heading>
            <Spacer h="1.2rem" />

            <form>
              <FormGrid>
                <Field name="name" label="Name" Input={ReadonlyInput} />
              </FormGrid>
            </form>

            <Spacer h="1.6rem" />

            <P>
              You are not an owner of this team. To manage team settings, please
              request owner rights from one of the current owners.
            </P>
          </Container>
        </AppLayout>
      </Auth>
    );
  }

  return (
    <Auth>
      <AppLayout>
        <Container>
          <Heading level={1}>Team settings</Heading>
          <Spacer h="1.2rem" />

          <form ref={form}>
            <FormGrid>
              <Field name="name" label="Name" Input={TextInput} required />
              <Field
                name="billingEmail"
                label="Billing email"
                Input={EmailInput}
              />
            </FormGrid>
          </form>
        </Container>
      </AppLayout>
    </Auth>
  );
}
