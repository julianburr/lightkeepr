import "src/utils/firebase";

import { useForm } from "react-cool-form";
import { useRouter } from "next/router";
import styled from "styled-components";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

import { api } from "src/utils/api-client";
import { useAuthUser } from "src/hooks/use-auth-user";
import { useErrorDialog } from "src/hooks/use-dialog";
import { AppLayout } from "src/layouts/app";
import { Form } from "src/components/form";
import { Field } from "src/components/field";
import { EmailInput } from "src/components/text-input";
import { SelectInput } from "src/components/select-input";
import { Button } from "src/components/button";
import { Auth } from "src/components/auth";
import { Heading, P } from "src/components/text";
import { Spacer } from "src/components/spacer";
import { ButtonBar } from "src/components/button-bar";

const db = getFirestore();

const Container = styled.div`
  width: 100%;
  max-width: 45rem;
`;

export default function NewUser() {
  const authUser = useAuthUser();
  const router = useRouter();

  const errorDialog = useErrorDialog();

  const { teamId } = router.query;

  const { form, use } = useForm({
    defaultValues: { email: "", role: { value: "member", label: "Member" } },
    onSubmit: async (values) => {
      try {
        const teamRef = doc(db, "teams", teamId!);
        const userRef = doc(db, "users", values.email);
        const currentUserRef = doc(db, "users", authUser.user!.id);

        const check = await getDocs(
          query(
            collection(db, "teamUsers"),
            where("team", "==", teamRef),
            where("user", "==", userRef)
          )
        );

        if (check.size > 0) {
          errorDialog.open({
            message: "The requested user is already part of the team.",
          });
          return;
        }

        const teamUser = await addDoc(collection(db, "teamUsers"), {
          team: teamRef,
          user: userRef,
          role: values.role.value,
          status: "pending",
          createdAt: new Date(),
          createdBy: currentUserRef,
        });
        await api.post("/api/account/invite-user", { teamUserId: teamUser.id });

        router.push(`/app/${teamId}/users`);
      } catch (e: any) {
        console.error(e);
      }
    },
  });

  if (authUser.teamUser?.role !== "owner") {
    return (
      <Auth>
        <AppLayout>
          <Container>
            <Heading level={1}>
              401 - You don't have the required permissions
            </Heading>
            <Spacer h="1.2rem" />
            <P>
              You are not an owner of this team. To manage and invite users,
              please request owner rights from one of the current owners.
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
          <Heading level={1}>Invite new user</Heading>
          <Spacer h="1.2rem" />

          <Form ref={form} id="invite-user">
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
                  form="invite-user"
                  disabled={use("isSubmitting")}
                >
                  Invite
                </Button>
              }
            />
          </Form>
        </Container>
      </AppLayout>
    </Auth>
  );
}
