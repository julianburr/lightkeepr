import firebase from "firebase/app";
import styled from "styled-components";
import { useForm } from "react-cool-form";
import { useHistory } from "react-router";

import { Field } from "../../components/field";
import { TextInput } from "../../components/inputs/text-input";
import { Button } from "../../components/button";
import { ButtonBar } from "../../components/button-bar";
import { useAuth } from "../../hooks/@firebase";

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Content = styled.div``;

const Illustration = styled.div`
  margin-left: 3rem;
  width: 50%;
  height: 60rem;
  background: red;
  flex-shrink: 0;

  @media (max-width: 800px) {
    display: none;
  }
`;

export function CreateProjectScreen() {
  const authUser = useAuth();
  const history = useHistory();

  const { form, getState } = useForm({
    onSubmit: async (values) => {
      console.log("submit", { values });
      const created = await firebase
        .firestore()
        .collection("projects")
        .add({
          owner: authUser.uid,
          collaborators: [authUser.uid],
          createdAt: new Date(),
          name: values.name,
        });

      console.log("done");
      history.push(`/p/${created.id}`);
    },
  });

  const isSubmitting = getState("isSubmitting");
  const errors = getState("errors", { errorWithTouched: true });

  return (
    <Container>
      <Content>
        <h1>Create new project</h1>
        <p>
          Projects are how builds are grouped. You likely want to create a
          project per app or website. Within a project, you can filter by branch
          and url, no need to create multiple projects for those.
        </p>

        <form ref={form} noValidate>
          <Field
            name="name"
            label="Project name"
            Input={TextInput}
            error={errors.name}
            required
          />
          <ButtonBar>
            <Button primary type="submit" loading={isSubmitting}>
              Create project
            </Button>
          </ButtonBar>
        </form>
      </Content>
      <Illustration></Illustration>
    </Container>
  );
}
