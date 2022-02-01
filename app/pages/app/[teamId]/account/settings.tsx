import "src/utils/firebase";

import styled from "styled-components";
import { doc, getFirestore, updateDoc } from "firebase/firestore";

import { useDocument } from "src/@packages/firebase";
import { useAuthUser } from "src/hooks/use-auth-user";
import { AppLayout } from "src/layouts/app";
import { useAutoSaveForm } from "src/hooks/use-auto-save-form";
import { Auth } from "src/components/auth";
import { Heading } from "src/components/text";
import { Spacer } from "src/components/spacer";
import { Field } from "src/components/field";
import { ReadonlyInput } from "src/components/readonly-input";
import { TextInput } from "src/components/text-input";
import { FormGrid } from "src/components/form-grid";

const db = getFirestore();

const Container = styled.div`
  width: 100%;
  max-width: 45rem;
`;

export default function AccountSettings() {
  const authUser = useAuthUser();

  const userId = authUser.user?.id;
  const userRef = doc(db, "users", userId!);

  const user = useDocument(userRef);

  const { form } = useAutoSaveForm({
    defaultValues: { email: user.id, name: user.name },
    onSubmit: (values) => updateDoc(userRef, { name: values.name }),
  });

  return (
    <Auth>
      <AppLayout>
        <Container>
          <Heading level={1}>Profile settings</Heading>
          <Spacer h="1.2rem" />

          <form ref={form}>
            <FormGrid>
              <Field
                name="email"
                label="Email"
                Input={ReadonlyInput}
                inputProps={{ value: user.id }}
              />
              <Field name="name" label="Name" Input={TextInput} required />
            </FormGrid>
          </form>
        </Container>
      </AppLayout>
    </Auth>
  );
}
