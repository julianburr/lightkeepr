import "src/utils/firebase";

import { useForm } from "react-cool-form";
import { addDoc, collection, doc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";

import { useAuthUser } from "src/hooks/use-auth-user";
import { AppLayout } from "src/layouts/app";
import { Form } from "src/components/form";
import { Field } from "src/components/field";
import { EmailInput } from "src/components/text-input";
import { SelectInput } from "src/components/select-input";
import { Button } from "src/components/button";
import { Auth } from "src/components/auth";
import { Heading } from "src/components/text";
import { Spacer } from "src/components/spacer";

const db = getFirestore();

export default function NewUser() {
  const router = useRouter();
  const authUser = useAuthUser();

  const { form, use } = useForm({
    defaultValues: { email: "", role: { value: "member", label: "Member" } },
    onSubmit: async (values) => {
      try {
        const teamId = router.query.teamId;
        const teamRef = doc(db, "teams", teamId!);

        const userRef = doc(db, "users", values.email);
        const currentUserRef = doc(db, "users", authUser.user!.id);

        await addDoc(collection(db, "teamUsers"), {
          team: teamRef,
          user: userRef,
          role: values.role.value,
          status: "pending",
          createdAt: new Date(),
          createdBy: currentUserRef,
        });

        router.push(`/app/${teamId}/users`);
      } catch (e: any) {
        console.error(e);
      }
    },
  });

  return (
    <Auth>
      <AppLayout>
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
          <Button
            type="submit"
            intend="primary"
            form="invite-user"
            disabled={use("isSubmitting")}
          >
            Invite
          </Button>
        </Form>
      </AppLayout>
    </Auth>
  );
}
