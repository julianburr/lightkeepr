import "src/utils/firebase";

import { useForm } from "react-cool-form";
import { useRouter } from "next/router";
import { addDoc, collection, doc, getFirestore } from "firebase/firestore";

import { Auth } from "src/components/auth";
import { Button } from "src/components/button";
import { Field } from "src/components/field";
import { Form } from "src/components/form";
import { TextInput } from "src/components/text-input";
import { AppLayout } from "src/layouts/app";
import { useAuthUser } from "src/hooks/use-auth-user";

const db = getFirestore();

export default function NewProject() {
  const router = useRouter();
  const authUser = useAuthUser();

  const { form, use } = useForm({
    onSubmit: async (values) => {
      const orgId = authUser.organisationUser.organisation.id;
      const orgRef = doc(db, "organisations", orgId);

      const userRef = doc(db, "users", authUser.user.id);

      const project = await addDoc(collection(db, "projects"), {
        organisation: orgRef,
        name: values.name,
        createdAt: new Date(),
        createdBy: userRef,
      });
      router.push(`/app/${router.query.orgUserId}/projects/${project.id}`);
    },
  });

  return (
    <Auth>
      <AppLayout>
        <h1>Create new project</h1>

        <Form ref={form}>
          <Field name="name" label="Project name" Input={TextInput} required />
          <Button type="submit" intend="primary" disabled={use("isSubmitting")}>
            Create project
          </Button>
        </Form>
      </AppLayout>
    </Auth>
  );
}
