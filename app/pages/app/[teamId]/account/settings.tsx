import "src/utils/firebase";

import styled from "styled-components";
import { doc, getFirestore, updateDoc } from "firebase/firestore";

import { useAuthUser } from "src/hooks/use-auth-user";
import { AppLayout } from "src/layouts/app";
import { Auth } from "src/components/auth";
import { Heading } from "src/components/text";
import { Spacer } from "src/components/spacer";
import { Form } from "src/components/form";
import { Field } from "src/components/field";
import { ReadonlyInput } from "src/components/readonly-input";
import { useDocument } from "src/@packages/firebase";
import { TextInput } from "src/components/text-input";
import { ButtonBar } from "src/components/button-bar";
import { Button } from "src/components/button";
import { useForm } from "react-cool-form";
import { useToast } from "src/hooks/use-toast";

const db = getFirestore();

const Container = styled.div`
  width: 100%;
  max-width: 45rem;
`;

export default function AccountSettings() {
  const authUser = useAuthUser();
  const toast = useToast();

  const userId = authUser.user?.id;
  const userRef = doc(db, "users", userId!);

  const user = useDocument(userRef);

  const { form, use } = useForm({
    defaultValues: { email: user.email, name: user.name },
    onSubmit: async (values) => {
      await updateDoc(userRef, { name: values.name });
      toast.show({ message: "Profile settings have been updated" });
    },
  });

  return (
    <Auth>
      <AppLayout>
        <Container>
          <Heading level={1}>Profile settings</Heading>
          <Spacer h="1.2rem" />

          <Form ref={form}>
            <Field
              name="email"
              label="Email"
              Input={ReadonlyInput}
              inputProps={{ value: user.id }}
            />
            <Field name="name" label="Name" Input={TextInput} required />
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
          </Form>
        </Container>
      </AppLayout>
    </Auth>
  );
}
