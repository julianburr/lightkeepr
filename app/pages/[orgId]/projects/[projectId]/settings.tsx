import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useForm } from "react-cool-form";

import { useDocument } from "src/@packages/firebase";
import { Field } from "src/components/form/field";
import { TextInput } from "src/components/text-input";

const db = getFirestore();

export default function ProjectSettingsScreen() {
  const router = useRouter();
  const { projectId } = router.query;

  const projectRef = doc(db, "projects", projectId);
  const project = useDocument(projectRef);
  const { form } = useForm({
    defaultValues: {
      name: project.name,
    },
    onSubmit: async (values) => {
      await setDoc(projectRef, { name: values.name }, { merge: true });
    },
  });

  return (
    <>
      <h1>
        Project #{projectId} / {project.name} - Settings
      </h1>
      <form ref={form}>
        <Field name="name" label="Project name" Input={TextInput} required />
        <button type="submit">Update</button>
      </form>
    </>
  );
}
