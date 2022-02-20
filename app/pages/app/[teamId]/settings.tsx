import "src/utils/firebase";

import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import styled from "styled-components";

import { Auth } from "src/components/auth";
import { Button } from "src/components/button";
import { ButtonBar } from "src/components/button-bar";
import { Field } from "src/components/field";
import { FormGrid } from "src/components/form-grid";
import { ReadonlyInput } from "src/components/readonly-input";
import { Spacer } from "src/components/spacer";
import { Heading, P, Small } from "src/components/text";
import { EmailInput, TextInput } from "src/components/text-input";
import { useConfirmationDialog } from "src/dialogs/confirm";
import { useApi } from "src/hooks/use-api";
import { useAuthUser } from "src/hooks/use-auth-user";
import { useAutoSaveForm } from "src/hooks/use-auto-save-form";
import { useToast } from "src/hooks/use-toast";
import { AppLayout } from "src/layouts/app";
import { event } from "src/utils/ga";

const db = getFirestore();

const Container = styled.div`
  width: 100%;
  max-width: 45rem;
`;

export default function TeamSettings() {
  const authUser = useAuthUser();
  const router = useRouter();

  const api = useApi();

  const toast = useToast();
  const confirmationDialog = useConfirmationDialog();

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
    <Auth key={router.query.teamId}>
      <AppLayout>
        <Container>
          <Heading level={1}>Team settings</Heading>
          <Spacer h="3.2rem" />

          <Heading level={2}>General settings</Heading>
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

          <Spacer h="3.2rem" />

          <Heading level={2}>Delete team</Heading>
          <Small grey>
            This action will delete the team together with all its projects,
            runs and reports. This cannot be reverted, so please make sure you
            really want to do this.
          </Small>
          <Small grey>
            If you currently have a subscription to the premium plan, this
            subscription will be cancelled by the end of the current period when
            deleting the team.
          </Small>
          <Spacer h=".6rem" />
          <ButtonBar
            left={
              <Button
                intent="danger"
                onClick={() =>
                  confirmationDialog.open({
                    message:
                      "Are you sure you want to delete this team and all its projects, runs and reports? This action cannot be reverted.",
                    confirmLabel: "Delete team",
                    intent: "danger",
                    onConfirm: async () => {
                      await api.post("/api/account/archive");
                      toast.show({ message: "Team has been deleted" });
                      event({ action: "team_delete" });
                    },
                  })
                }
              >
                Delete team
              </Button>
            }
          />
        </Container>
      </AppLayout>
    </Auth>
  );
}
