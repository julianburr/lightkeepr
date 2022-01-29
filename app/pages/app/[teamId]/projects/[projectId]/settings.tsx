import "src/utils/firebase";

import { useForm } from "react-cool-form";
import { useRouter } from "next/router";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import styled from "styled-components";

import { useDocument } from "src/@packages/firebase";
import { generateApiToken } from "src/utils/api-token";
import { useConfirmationDialog } from "src/hooks/use-dialog";
import { useToast } from "src/hooks/use-toast";
import { AppLayout } from "src/layouts/app";
import { Auth } from "src/components/auth";
import { Button } from "src/components/button";
import { Field } from "src/components/field";
import { TextInput } from "src/components/text-input";
import { Spacer } from "src/components/spacer";
import { ButtonBar } from "src/components/button-bar";
import { ReadonlyInput } from "src/components/readonly-input";
import { CopyButton } from "src/components/copy-button";
import { Tooltip } from "src/components/tooltip";

import RefreshSvg from "src/assets/icons/refresh-cw.svg";
import { useAuthUser } from "src/hooks/use-auth-user";
import { Heading } from "src/components/text";
import { FormGrid } from "src/components/form-grid";
import { useCallback } from "react";
import { CheckboxInput } from "src/components/checkbox-input";
import { RangeInput } from "src/components/range-input";

const db = getFirestore();

const Container = styled.div`
  width: 100%;
  max-width: 45rem;
`;

export default function ProjectSettings() {
  const authUser = useAuthUser();
  const router = useRouter();

  const toast = useToast();
  const confirmationDialog = useConfirmationDialog();

  const projectRef = doc(db, "projects", router.query.projectId!);
  const project = useDocument(projectRef);

  const { form, use } = useForm({
    defaultValues: {
      name: project.name,
      gitMain: project.gitMain,
      failOnRegression: project.failOnRegression,
      performanceBudget: project.budget?.performance,
      accessibilityBudget: project.budget?.accessibility,
      bestPracticesBudget: project.budget?.["best-practices"],
      seoBudget: project.budget?.seo,
      pwaBudget: project.budget?.pwa,
    },
    onSubmit: async (values) => {
      await updateDoc(projectRef, {
        name: values.name,
        gitMain: values.gitMain,
        failOnRegression: values.failOnRegression,
        budget: {
          performance: values.performanceBudget,
          accessibility: values.accessibilityBudget,
          ["best-practices"]: values.bestPracticesBudget,
          seo: values.seoBudget,
          pwa: values.pwaBudget,
        },
      });
      toast.show({ message: "Project settings have been updated" });
    },
  });

  const handleRefresh = useCallback(() => {
    confirmationDialog.open({
      message:
        "Are you sure you want to refresh the API key? The current key " +
        "will become invalid and cannot be used after this.",
      onConfirm: async () => {
        await updateDoc(doc(db, "projects", router.query.projectId!), {
          apiToken: generateApiToken(),
        });
      },
    });
  }, []);

  return (
    <Auth>
      <AppLayout>
        <Container>
          <h1>Project settings</h1>
          <Spacer h="1.6rem" />

          <form ref={form}>
            <FormGrid>
              <Field
                name="apiToken"
                label="API token"
                Input={ReadonlyInput}
                inputProps={{
                  value: project.apiToken,
                  suffix: (
                    <>
                      <CopyButton
                        size="small"
                        intent="ghost"
                        text={project.apiToken}
                      />
                      {authUser.teamUser?.role === "owner" && (
                        <Tooltip content="Refresh API key">
                          {(props) => (
                            <Button
                              size="small"
                              intent="ghost"
                              icon={<RefreshSvg />}
                              onClick={handleRefresh}
                              {...props}
                            />
                          )}
                        </Tooltip>
                      )}
                    </>
                  ),
                }}
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
                description={
                  `This information is used to be able to compare a given ` +
                  `report to the latest report on your base branch`
                }
                Input={TextInput}
              />
            </FormGrid>

            <Spacer h="2.4rem" />

            <Heading level={2}>Budgets and conditions</Heading>
            <Spacer h="1.2rem" />
            <FormGrid>
              <Field
                name="failOnRegression"
                label="Fail on score regression"
                description={
                  `Whenever a report has a regression of more than 2 points in any of ` +
                  `the scores compared to the previous report on the same branch, the ` +
                  `report will marked as failed.`
                }
                Input={CheckboxInput}
                inputProps={{ label: "Enable" }}
              />
              <Field
                name="performanceBudget"
                label="Performance budget"
                Input={RangeInput}
              />
              <Field
                name="accessibilityBudget"
                label="Accessibility budget"
                Input={RangeInput}
              />
              <Field
                name="bestPracticesBudget"
                label="Best practices budget"
                Input={RangeInput}
              />
              <Field name="seoBudget" label="SEO budget" Input={RangeInput} />
              <Field name="pwaBudget" label="PWA budget" Input={RangeInput} />
              <ButtonBar
                left={
                  <Button
                    type="submit"
                    intent="primary"
                    disabled={use("isSubmitting")}
                  >
                    Update settings
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
