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
import { Heading, Small } from "src/components/text";
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
      performanceTarget: project.targets?.performance || 0,
      accessibilityTarget: project.targets?.accessibility || 0,
      bestPracticesTarget: project.targets?.["best-practices"] || 0,
      seoTarget: project.targets?.seo || 0,
      pwaTarget: project.targets?.pwa || 0,
    },
    onSubmit: async (values) => {
      await updateDoc(projectRef, {
        name: values.name,
        gitMain: values.gitMain,
        failOnRegression: values.failOnRegression,
        targets: {
          performance: values.performanceTarget,
          accessibility: values.accessibilityTarget,
          ["best-practices"]: values.bestPracticesTarget,
          seo: values.seoTarget,
          pwa: values.pwaTarget,
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

            <Heading level={2}>Reports</Heading>
            <Spacer h="1.2rem" />
            <Field
              name="failOnRegression"
              Input={CheckboxInput}
              inputProps={{
                label: "Fail on score regression",
                description: (
                  <>
                    Whenever a report has a regression of more than 2 points in
                    any of the scores compared to the previous report on the
                    same branch, the report will marked as failed.
                  </>
                ),
              }}
            />

            <Spacer h="1.6rem" />

            <Heading level={3}>Score targets</Heading>
            <Small grey>
              These targets allow you to specify the score you want to aim for
              in all reports in this project. If the scores are below their
              targets, the report will be marked as failed.
            </Small>
            <Spacer h=".6rem" />

            <FormGrid columns={2}>
              <Field
                name="performanceTarget"
                label="Performance"
                Input={RangeInput}
              />
              <Field
                name="accessibilityTarget"
                label="Accessibility"
                Input={RangeInput}
              />
              <Field
                name="bestPracticesTarget"
                label="Best practices"
                Input={RangeInput}
              />
              <Field name="seoTarget" label="SEO" Input={RangeInput} />
              <Field name="pwaTarget" label="PWA" Input={RangeInput} />
            </FormGrid>

            <Spacer h="1.6rem" />
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
          </form>
        </Container>
      </AppLayout>
    </Auth>
  );
}
