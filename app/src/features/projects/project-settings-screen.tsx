import firebase from "firebase/app";
import { Suspense } from "react";
import { useForm } from "react-cool-form";
import { useParams } from "react-router";

import { Button } from "../../components/button";
import { ButtonBar } from "../../components/button-bar";
import { Field } from "../../components/field";
import { TextInput } from "../../components/inputs/text-input";
import { List, ListItem } from "../../components/list";
import { TitleBar } from "../../components/title-bar";
import { useDocument } from "../../hooks/@firebase";

function ProjectSettings() {
  const { projectId } = useParams<{ projectId: string }>();

  const project = useDocument(
    firebase.firestore().collection("projects").doc(projectId)
  );

  const { form, getState } = useForm({
    defaultValues: { name: project.name },
    onSubmit: async (values) => {
      await firebase
        .firestore()
        .collection("projects")
        .doc(projectId)
        .update({ name: values.name });
    },
  });

  const isSubmitting = getState("isSubmitting");

  return (
    <>
      <form ref={form} noValidate>
        <Field name="name" label="Project name" Input={TextInput} required />
        <ButtonBar>
          <Button primary type="submit" loading={isSubmitting}>
            Update
          </Button>
        </ButtonBar>
      </form>

      <TitleBar>
        <h1>Collaborators</h1>
        <Button to={`/p/${projectId}/settings/add-collaborators`}>
          Add collaborators
        </Button>
      </TitleBar>
      <List
        items={project.collaborators}
        Item={({ data }) => <ListItem title={`#${data}`} />}
      />

      <h1>Delete project</h1>
      <p>
        This action cannot be reverted. Please make sure you know what you're
        doing when deleting a project.
      </p>
      <ButtonBar>
        <Button destructive>Delete</Button>
      </ButtonBar>
    </>
  );
}

export function ProjectSettingsScreen() {
  return (
    <>
      <h1>Project Settings</h1>
      <Suspense fallback={<p>Loading project...</p>}>
        <ProjectSettings />
      </Suspense>
    </>
  );
}
