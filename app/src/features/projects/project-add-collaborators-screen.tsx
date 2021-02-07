import { useForm } from "react-cool-form";

import { Button } from "../../components/button";
import { ButtonBar } from "../../components/button-bar";
import { Field } from "../../components/field";
import { TextInput } from "../../components/inputs/text-input";

export function ProjectAddCollaboratorsScreen() {
  const { form, getState } = useForm({
    onSubmit: async (values) => {},
  });

  const isSubmitting = getState("isSubmitting");

  return (
    <>
      <h1>Invite your team members</h1>
      <p>
        Enter the emails of the users you want to add as collaborators to the
        project.
      </p>

      <form ref={form} noValidate>
        <Field name="emails" label="Emails" Input={TextInput} required />
        <ButtonBar>
          <Button primary type="submit" loading={isSubmitting}>
            Invite
          </Button>
        </ButtonBar>
      </form>
    </>
  );
}
