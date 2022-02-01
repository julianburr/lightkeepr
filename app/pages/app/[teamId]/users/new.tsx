import "src/utils/firebase";

import { useForm } from "react-cool-form";
import { useRouter } from "next/router";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import styled from "styled-components";

import { useDocument } from "src/@packages/firebase";
import { api } from "src/utils/api-client";
import { useAuthUser } from "src/hooks/use-auth-user";
import { useErrorDialog } from "src/hooks/use-dialog";
import { useToast } from "src/hooks/use-toast";
import { AppLayout } from "src/layouts/app";
import { Field } from "src/components/field";
import { EmailInput } from "src/components/text-input";
import { SelectInput } from "src/components/select-input";
import { Button } from "src/components/button";
import { Auth } from "src/components/auth";
import { Heading, P } from "src/components/text";
import { Spacer } from "src/components/spacer";
import { ButtonBar } from "src/components/button-bar";
import { FormGrid } from "src/components/form-grid";
import { Suspense } from "react";
import { Loader } from "src/components/loader";
import { PermissionError } from "src/@packages/firebase/firestore/context";

const db = getFirestore();

const Container = styled.div`
  width: 100%;
  max-width: 45rem;
`;

function Content() {
  const authUser = useAuthUser();
  const router = useRouter();

  const toast = useToast();
  const errorDialog = useErrorDialog();

  const teamRef = doc(db, "teams", router.query.teamId!);
  const team = useDocument(teamRef);

  const { form, use } = useForm({
    defaultValues: {
      email: "",
      role: { value: "member", label: "Member" },
    },
    onSubmit: async (values) => {
      try {
        const currentUserRef = doc(db, "users", authUser.uid!);

        // Check if user is already invited
        if (team.invites?.includes?.(values.email)) {
          errorDialog.open({
            message: "The requested user is already invited to the team.",
          });
          return;
        }

        // TODO: check existing users

        await updateDoc(teamRef, {
          invites: [...(team.invites || []), values.email],
          inviteStatus: {
            ...(team.inviteStatus || {}),
            [values.email]: {
              status: "pending",
              role: values.role.value,
              createdAt: new Date(),
              createdBy: currentUserRef,
            },
          },
        });
        await api.post("/api/account/invite-user", {
          email: values.email,
          teamId: team.id,
        });

        router.push(`/app/${team.id}/users`);
        toast.show({ message: `Invite sent to ${values.email}` });
      } catch (e: any) {
        errorDialog.open(e);
      }
    },
  });

  if (authUser.teamRole !== "owner") {
    throw new PermissionError({
      message:
        "You don't have the required permissions. To manage and invite users, please " +
        "request owner rights from one of the current owners.",
    });
  }

  return (
    <Container>
      <Heading level={1}>Invite new user</Heading>
      <Spacer h="1.2rem" />

      <form ref={form}>
        <FormGrid>
          <Field name="email" label="Email" Input={EmailInput} required />
          <Field
            name="role"
            label="Role"
            Input={SelectInput}
            inputProps={{
              items: [
                { value: "owner", label: "Owner" },
                { value: "member", label: "Member" },
                { value: "billing", label: "Billing manager" },
              ],
            }}
            required
          />
          <ButtonBar
            left={
              <Button
                type="submit"
                intent="primary"
                disabled={use("isSubmitting")}
              >
                Invite
              </Button>
            }
          />
        </FormGrid>
      </form>
    </Container>
  );
}

export default function NewUser() {
  return (
    <Auth>
      <AppLayout>
        <Suspense fallback={<Loader />}>
          <Content />
        </Suspense>
      </AppLayout>
    </Auth>
  );
}
