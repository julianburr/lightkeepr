import { useForm } from "react-cool-form";
import { getFirestore, doc, setDoc } from "firebase/firestore";

import { useAuth } from "../../@packages/firebase";

import { Field } from "../../components/form/field";
import { TextInput } from "../../components/text-input";

const db = getFirestore();

export function ProfileSetupScreen() {
  const authUser = useAuth();

  const { form, use } = useForm({
    defaultValues: { name: authUser.displayName },
    onSubmit: (values) => {
      return setDoc(doc(db, "users", authUser.email), { name: values.name });
    },
  });

  const isSubmitting = use("isSubmitting");

  return (
    <form ref={form}>
      <h1>Set up your profile</h1>
      <Field Input={TextInput} name="name" label="Name" />
      <button disabled={isSubmitting}>Submit</button>
    </form>
  );
}
