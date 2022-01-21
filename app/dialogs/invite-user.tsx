import { useForm } from "react-cool-form";
import { addDoc, collection, doc, getFirestore } from "firebase/firestore";

import { useAuthUser } from "src/hooks/use-auth-user";
import { Button } from "src/components/button";
import { ButtonBar } from "src/components/button-bar";
import { Dialog, DialogPassthroughProps } from "src/components/dialog";
import { Field } from "src/components/field";
import { Form } from "src/components/form";
import { EmailInput } from "src/components/text-input";
import { SelectInput } from "src/components/select-input";

const db = getFirestore();

export function InviteUserDialog({ onClose }: DialogPassthroughProps) {
  const authUser = useAuthUser();

  const { form, use } = useForm({
    defaultValues: { email: "", role: "member" },
    onSubmit: async (values) => {
      try {
        const orgId = authUser.organisationUser?.organisation?.id;
        const orgRef = doc(db, "organisations", orgId);

        const userRef = doc(db, "users", values.email);
        const currentUserRef = doc(db, "users", authUser.user.id);

        await addDoc(collection(db, "organisationUsers"), {
          organisation: orgRef,
          user: userRef,
          role: values.role,
          status: "pending",
          created: new Date(),
          createdBy: currentUserRef,
        });
        onClose?.();
      } catch (e: any) {
        console.error(e);
      }
    },
  });

  return (
    <Dialog
      title="Invite new user"
      actions={
        <ButtonBar
          right={
            <Button
              type="submit"
              form="invite-user"
              disabled={use("isSubmitting")}
            >
              Invite
            </Button>
          }
        />
      }
    >
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
      </Form>
    </Dialog>
  );
}
