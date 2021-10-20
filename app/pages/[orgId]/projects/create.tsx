import { getFirestore, doc, collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useForm } from "react-cool-form";

import { Field } from "src/components/form/field";
import { TextInput } from "src/components/text-input";

const db = getFirestore();

export default function CreateProjectScreen() {
  const router = useRouter();
  const { orgId } = router.query;

  const { form } = useForm({
    onSubmit: async (values) => {
      const orgRef = doc(db, "organisations", orgId);
      const project = await addDoc(collection(db, "projects"), {
        name: values.name,
        organisation: orgRef,
      });
      router.push(`/${orgId}/projects/${project.id}`);
    },
  });

  return (
    <>
      <h1>Create Project</h1>
      <form ref={form}>
        <Field name="name" label="Project name" Input={TextInput} required />
        <button type="submit">Create</button>
      </form>
    </>
  );
}
