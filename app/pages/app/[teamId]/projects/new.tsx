import "src/utils/firebase";

import { addDoc, collection, doc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";
import { useForm } from "react-cool-form";
import styled from "styled-components";

import { Auth } from "src/components/auth";
import { Button } from "src/components/button";
import { ButtonBar } from "src/components/button-bar";
import { Field } from "src/components/field";
import { FormGrid } from "src/components/form-grid";
import { Spacer } from "src/components/spacer";
import { TextInput } from "src/components/text-input";
import { useAuthUser } from "src/hooks/use-auth-user";
import { AppLayout } from "src/layouts/app";
import { generateApiToken } from "src/utils/token";

const db = getFirestore();

const Container = styled.div`
  width: 100%;
  max-width: 45rem;
`;

export default function NewProject() {
  const router = useRouter();
  const authUser = useAuthUser();

  const { form, use } = useForm({
    defaultValues: { name: "", gitMain: "main" },
    onSubmit: async (values) => {
      const teamId = router.query.teamId;

      const teamRef = doc(db, "teams", teamId!);
      const userRef = doc(db, "users", authUser.user!.id);

      const project = await addDoc(collection(db, "projects"), {
        team: teamRef,
        name: values.name,
        gitMain: values.gitMain,
        apiToken: generateApiToken(),
        createdAt: new Date(),
        createdBy: userRef,
      });
      router.push(`/app/${router.query.teamId}/projects/${project.id}`);
    },
  });

  return (
    <Auth>
      <AppLayout>
        <Container>
          <h1>Create a new project</h1>
          <Spacer h="1.6rem" />

          <form ref={form}>
            <FormGrid>
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
                    intent="primary"
                    disabled={use("isSubmitting")}
                  >
                    Create project
                  </Button>
                }
              />
            </FormGrid>
          </form>
        </Container>
      </AppLayout>
    </Auth>
  );
}
