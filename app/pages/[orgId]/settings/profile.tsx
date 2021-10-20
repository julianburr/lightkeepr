import { useRouter } from "next/router";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useForm } from "react-cool-form";

import { Field } from "src/components/form/field";
import { EmailInput, TextInput } from "src/components/text-input";
import { useAuth, useDocument } from "src/@packages/firebase";

const db = getFirestore();

export default function ProfileSettingsScreen() {
  const authUser = useAuth();

  const userRef = doc(db, "users", authUser.email);
  const user = useDocument(userRef);
  const { form } = useForm({
    defaultValues: {
      email: user.email,
      name: user.name,
    },
    onSubmit: async (values) => {
      await setDoc(
        userRef,
        { name: values.name, email: values.email },
        { merge: true }
      );
    },
  });

  return (
    <>
      <h1>Profile Settings</h1>
      <form ref={form}>
        <Field name="email" label="Email address" Input={EmailInput} disabled />
        <Field name="name" label="Name" Input={TextInput} required />
        <button type="submit">Update</button>
      </form>
    </>
  );
}
