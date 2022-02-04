import {
  getAuth,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";
import { useForm } from "react-cool-form";

import { Button } from "src/components/button";
import { ButtonBar } from "src/components/button-bar";
import { Dialog } from "src/components/dialog";
import { Field } from "src/components/field";
import { FormGrid } from "src/components/form-grid";
import { PasswordInput } from "src/components/password-input";
import { Spacer } from "src/components/spacer";
import { P } from "src/components/text";
import { useAuthUser } from "src/hooks/use-auth-user";
import { useToast } from "src/hooks/use-toast";

const auth = getAuth();

export function UpdatePasswordDialog({ onClose }: any) {
  const authUser = useAuthUser();
  const toast = useToast();

  const { form, use } = useForm({
    id: "updatePassword",
    validate: (values) => {
      if (values.newPassword !== values.repeatPassword) {
        return { repeatPassword: "Passwords need to match" };
      }
    },
    onSubmit: async (values) => {
      await signInWithEmailAndPassword(
        auth,
        authUser.email!,
        values.currentPassword
      );
      await updatePassword(auth.currentUser!, values.newPassword);
      toast.show({ message: "Your passwort has been updated successfully" });
      onClose();
    },
  });

  return (
    <Dialog
      width="46rem"
      title="Update password"
      actions={
        <ButtonBar
          right={
            <>
              <Button intent="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                intent="primary"
                form="updatePassword"
                disabled={use("isSubmitting")}
              >
                Update password
              </Button>
            </>
          }
        />
      }
    >
      <P>
        Enter the new password below. Once you update your password, the old one
        will no longer be valid.
      </P>

      <Spacer h="1.2rem" />
      <form ref={form} id="updatePassword">
        <FormGrid>
          <Field
            form="updatePassword"
            name="currentPassword"
            label="Current password"
            Input={PasswordInput}
            showError={false}
            required
          />
          <Field
            form="updatePassword"
            name="newPassword"
            label="New password"
            Input={PasswordInput}
            showError={false}
            required
          />
          <Field
            form="updatePassword"
            name="repeatPassword"
            label="Repeat new password"
            Input={PasswordInput}
            showError={false}
            required
          />
        </FormGrid>
      </form>
    </Dialog>
  );
}
