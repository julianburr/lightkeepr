import "src/utils/firebase";

import { useCallback } from "react";
import { useRouter } from "next/router";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import styled from "styled-components";

import { useDocument } from "src/@packages/firebase";
import { generateApiToken } from "src/utils/api-token";
import { useConfirmationDialog } from "src/hooks/use-dialog";
import { useToast } from "src/hooks/use-toast";
import { useAutoSaveForm } from "src/hooks/use-auto-save-form";
import { AppLayout } from "src/layouts/app";
import { Auth } from "src/components/auth";
import { ButtonBar } from "src/components/button-bar";
import { Button } from "src/components/button";
import { Field } from "src/components/field";
import { TextInput } from "src/components/text-input";
import { Spacer } from "src/components/spacer";
import { ReadonlyInput } from "src/components/readonly-input";
import { CopyButton } from "src/components/copy-button";
import { Tooltip } from "src/components/tooltip";

import RefreshSvg from "src/assets/icons/refresh-cw.svg";
import { useAuthUser } from "src/hooks/use-auth-user";
import { Heading, Small } from "src/components/text";
import { FormGrid } from "src/components/form-grid";
import { CheckboxInput } from "src/components/checkbox-input";
import { RangeInput } from "src/components/range-input";
import { removeUndefined } from "src/utils/format";

const db = getFirestore();

const Container = styled.div`
  width: 100%;
  max-width: 45rem;
`;

export default function ProjectSettings() {
  const authUser = useAuthUser();
  const router = useRouter();

  const projectRef = doc(db, "projects", router.query.projectId!);
  const project = useDocument(projectRef);

  console.log({ project });

  if (!project) {
    const e: any = new Error("Project does not exist");
    e.code = 404;
    throw e;
  }

  const confirmationDialog = useConfirmationDialog();

  const { form } = useAutoSaveForm({
    defaultValues: {
      name: project?.name,
      gitMain: project?.gitMain,
      failOnRegression: project?.failOnRegression || false,
      targets: {
        performance: project?.targets?.performance || 0,
        accessibility: project?.targets?.accessibility || 0,
        "best-practices": project?.targets?.["best-practices"] || 0,
        seo: project?.targets?.seo || 0,
        pwa: project?.targets?.pwa || 0,
      },
    },
    onSubmit: async (values) => {
      console.log("#onSubmit");
      await updateDoc(projectRef, removeUndefined(values));
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
          <Spacer h="3.2rem" />

          <Heading level={2}>General settings</Heading>
          <Spacer h="1.2rem" />

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

            <Heading level={3}>Reports</Heading>
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
                name="targets.performance"
                label="Performance"
                Input={RangeInput}
              />
              <Field
                name="targets.accessibility"
                label="Accessibility"
                Input={RangeInput}
              />
              <Field
                name="targets.bestPractices"
                label="Best practices"
                Input={RangeInput}
              />
              <Field name="targets.seo" label="SEO" Input={RangeInput} />
              <Field name="targets.pwa" label="PWA" Input={RangeInput} />
            </FormGrid>
          </form>

          <Spacer h="3.2rem" />

          <Heading level={2}>Delete project</Heading>
          <Small grey>
            This action will delete the project together with all its runs and
            reports. This cannot be reverted, so please make sure you really
            want to do this.
          </Small>
          <Spacer h=".6rem" />
          <ButtonBar
            left={
              <Button
                intent="danger"
                onClick={() =>
                  confirmationDialog.open({
                    message:
                      "Are you sure you want to delete this project and all its runs and reports? This action cannot be reverted.",
                    confirmLabel: "Delete project",
                    intent: "danger",
                    onConfirm: () => {
                      deleteDoc(projectRef);
                      router.push(`/app/${router.query.teamId}`);
                    },
                  })
                }
              >
                Delete project
              </Button>
            }
          />
        </Container>
      </AppLayout>
    </Auth>
  );
}
