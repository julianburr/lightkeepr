import "src/utils/firebase";

import { doc, getFirestore, updateDoc } from "firebase/firestore";
import styled from "styled-components";

import { useDocument } from "src/@packages/firebase";
import { Auth } from "src/components/auth";
import { Button } from "src/components/button";
import { Field } from "src/components/field";
import { FormGrid } from "src/components/form-grid";
import { ReadonlyInput } from "src/components/readonly-input";
import { Spacer } from "src/components/spacer";
import { Heading, Small } from "src/components/text";
import { TextInput } from "src/components/text-input";
import { UpdatePasswordDialog } from "src/dialogs/account/update-password";
import { useAuthUser } from "src/hooks/use-auth-user";
import { useAutoSaveForm } from "src/hooks/use-auto-save-form";
import { useDialog } from "src/hooks/use-dialog";
import { AppLayout } from "src/layouts/app";

const db = getFirestore();

const Container = styled.div`
  width: 100%;
  max-width: 45rem;
`;

export default function AccountSettings() {
  const authUser = useAuthUser();
  const updatePasswordDialog = useDialog(UpdatePasswordDialog);

  const userId = authUser.user?.id;
  const userRef = doc(db, "users", userId!);

  const user = useDocument(userRef);

  const { form } = useAutoSaveForm({
    id: "accountSettings",
    defaultValues: { email: user.email, name: user.name },
    onSubmit: (values) => updateDoc(userRef, { name: values.name }),
  });

  return (
    <Auth>
      <AppLayout>
        <Container>
          <Heading level={1}>Profile</Heading>
          <Spacer h="1.6rem" />

          <Heading level={2}>General settings</Heading>
          <Spacer h="1.2rem" />

          <form ref={form} id="accountSettings">
            <FormGrid>
              <Field
                form="accountSettings"
                name="email"
                label="Email"
                Input={ReadonlyInput}
                inputProps={{ value: user.email }}
              />
              <Field
                form="accountSettings"
                name="name"
                label="Name"
                Input={TextInput}
                required
              />
            </FormGrid>
          </form>

          <Spacer h="3.2rem" />
          <Heading level={2}>Update password</Heading>
          <Small grey>
            Click the button below and enter a new password. Your old password
            will be invalid after you updated it.
          </Small>
          <Button onClick={() => updatePasswordDialog.open()}>
            Update password
          </Button>
        </Container>
      </AppLayout>
    </Auth>
  );
}
