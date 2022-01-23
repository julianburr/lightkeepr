import "src/utils/firebase";

import { useForm } from "react-cool-form";
import { useRouter } from "next/router";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import styled from "styled-components";

import { useDocument } from "src/@packages/firebase";
import { AppLayout } from "src/layouts/app";
import { Auth } from "src/components/auth";
import { Button } from "src/components/button";
import { Field } from "src/components/field";
import { Form } from "src/components/form";
import { TextInput } from "src/components/text-input";
import { Spacer } from "src/components/spacer";
import { ButtonBar } from "src/components/button-bar";
import { BackLink } from "src/components/back-link";
import { useToast } from "src/hooks/use-toast";
import { ReadonlyInput } from "src/components/readonly-input";

const db = getFirestore();

const Container = styled.div`
  width: 100%;
  max-width: 45rem;
`;

export default function ProjectSettings() {
  const router = useRouter();
  const { teamId, projectId } = router.query;

  const projectRef = doc(db, "projects", projectId!);
  const project = useDocument(projectRef);

  const toast = useToast();

  const { form, use } = useForm({
    defaultValues: { name: project.name, gitMain: project.gitMain },
    onSubmit: async (values) => {
      await updateDoc(projectRef, {
        name: values.name,
        gitMain: values.gitMain,
      });
      toast.show({ message: "Project settings have been updated" });
    },
  });

  return (
    <Auth>
      <AppLayout>
        <Container>
          <BackLink href={`/app/${teamId}/projects/${projectId}`}>
            Back to project overview
          </BackLink>
          <h1>Project settings</h1>
          <Spacer h="1.6rem" />

          <Form ref={form}>
            <Field
              name="id"
              label="Project ID"
              Input={ReadonlyInput}
              inputProps={{ value: project.id }}
            />
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
