import "src/utils/firebase";

import { useForm } from "react-cool-form";
import { useRouter } from "next/router";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import styled from "styled-components";

import { api } from "src/utils/api-client";
import { AppLayout } from "src/layouts/app";
import { useAuthUser } from "src/hooks/use-auth-user";
import { useToast } from "src/hooks/use-toast";
import { useConfirmationDialog } from "src/hooks/use-dialog";
import { Auth } from "src/components/auth";
import { Heading, P } from "src/components/text";
import { Spacer } from "src/components/spacer";
import { Field } from "src/components/field";
import { EmailInput, TextInput } from "src/components/text-input";
import { Button } from "src/components/button";
import { ButtonBar } from "src/components/button-bar";
import { ReadonlyInput } from "src/components/readonly-input";
import { FormGrid } from "src/components/form-grid";

const db = getFirestore();

const Container = styled.div`
  width: 100%;
  max-width: 45rem;
`;

export default function TeamSettings() {
  const authUser = useAuthUser();
  const router = useRouter();
  const toast = useToast();

  const { form, use } = useForm({
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

      toast.show({ message: "Team settings have been updated" });
    },
  });

  if (authUser.teamUser?.role !== "owner") {
    return (
      <Auth>
        <AppLayout>
          <Container>
            <Heading level={1}>Team settings</Heading>
            <Spacer h="1.2rem" />

            <form>
              <FormGrid>
                <Field
                  name="id"
                  label="Team ID"
                  Input={ReadonlyInput}
                  inputProps={{ value: authUser.team?.id }}
                />
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
              <Field
                name="id"
                label="Team ID"
                Input={ReadonlyInput}
                inputProps={{ value: authUser.team?.id }}
              />
              <Field name="name" label="Name" Input={TextInput} required />
              <Field
                name="billingEmail"
                label="Billing email"
                Input={EmailInput}
              />
              <ButtonBar
                left={
                  <Button
                    type="submit"
                    intent="primary"
                    disabled={use("isSubmitting")}
                  >
                    Update settings
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
