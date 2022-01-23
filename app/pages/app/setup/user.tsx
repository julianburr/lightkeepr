import "src/utils/firebase";

import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useForm } from "react-cool-form";

import { useAuthUser } from "src/hooks/use-auth-user";
import { SetupLayout } from "src/layouts/setup";
import { Auth } from "src/components/auth";
import { Field } from "src/components/field";
import { TextInput } from "src/components/text-input";
import { Button } from "src/components/button";
import { Form } from "src/components/form";
import { Spacer } from "src/components/spacer";

const db = getFirestore();

export default function UserSetup() {
  const authUser = useAuthUser();

  const { form, use } = useForm({
    defaultValues: { name: authUser.displayName },
    onSubmit: async (values) => {
      await setDoc(doc(db, "users", authUser.email!), {
        name: values.name,
      });
    },
  });

  return (
    <Auth>
      <SetupLayout>
        <h1>Please complete the set up of your user account</h1>
        <Spacer height="2.4rem" />

        <Form ref={form}>
          <Field name="name" label="Name" Input={TextInput} required />
          <Button intend="primary" type="submit" disabled={use("isSubmitting")}>
            Create account
          </Button>
        </Form>
      </SetupLayout>
    </Auth>
  );
}
