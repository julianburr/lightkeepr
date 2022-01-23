import "src/utils/firebase";

import { useForm } from "react-cool-form";
import { useRouter } from "next/router";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import styled from "styled-components";

import { Auth } from "src/components/auth";
import { Button } from "src/components/button";
import { Field } from "src/components/field";
import { Form } from "src/components/form";
import { TextInput } from "src/components/text-input";
import { AppLayout } from "src/layouts/app";
import { Spacer } from "src/components/spacer";
import { useDocument } from "src/@packages/firebase";
import { ButtonBar } from "src/components/button-bar";

const db = getFirestore();

const Container = styled.div`
  width: 100%;
  max-width: 45rem;
`;

export default function ProjectSettings() {
  const router = useRouter();

  const projectRef = doc(db, "projects", router.query.projectId!);
  const project = useDocument(projectRef);

  const { form, use } = useForm({
    defaultValues: { name: project.name, gitMain: project.gitMain },
    onSubmit: async (values) => {
      await updateDoc(projectRef, {
        name: values.name,
        gitMain: values.gitMain,
      });
    },
  });

  return (
    <Auth>
      <AppLayout>
        <Container>
          <h1>Project settings</h1>
          <Spacer h="1.6rem" />

          <Form ref={form}>
            <Field
              name="name"
              label="Project name"
              Input={TextInput}
              required
            />
            <Field
              name="gitMain"
              label="Git base branch name"
              description="This information is used to be able to compare a given report to the latest report on your base branch"
              Input={TextInput}
            />
            <ButtonBar
              left={
                <Button
                  type="submit"
                  intend="primary"
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
