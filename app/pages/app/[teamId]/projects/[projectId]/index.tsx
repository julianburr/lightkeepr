import "src/utils/firebase";

import {
  collection,
  doc,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import styled from "styled-components";

import { useCollection, useDocument } from "src/@packages/firebase";
import { ActionMenu } from "src/components/action-menu";
import { Auth } from "src/components/auth";
import { Button } from "src/components/button";
import { ButtonBar } from "src/components/button-bar";
import { CodePreview } from "src/components/code-preview";
import { HelpBox } from "src/components/help-box";
import { Hint } from "src/components/hint";
import { List } from "src/components/list";
import { Loader } from "src/components/loader";
import { ProjectActions } from "src/components/project/actions";
import { Spacer } from "src/components/spacer";
import { Suspense } from "src/components/suspense";
import { GroupHeading, Heading, P, Small } from "src/components/text";
import { useRunFilters } from "src/hooks/use-run-filters";
import { AppLayout } from "src/layouts/app";
import { PageListItem } from "src/list-items/page";
import { RunListItem } from "src/list-items/run";

const db = getFirestore();

const Container = styled.div`
  width: 100%;
  max-width: 60rem;
`;

function Content() {
  const router = useRouter();
  const { projectId } = router.query;

  const projectRef = doc(db, "projects", projectId!);
  const project = useDocument(projectRef);

  const runs: any[] = useCollection(
    query(
      collection(db, "runs"),
      where("project", "==", projectRef),
      orderBy("startedAt", "desc")
    ),
    { key: `${router.query.projectId}/runs` }
  );

  const { filters, filterItems } = useRunFilters({
    runs,
    gitMain: project.gitMain,
  });

  const [runsLimit, setRunsLimit] = useState(5);
  const filteredRuns = useMemo(
    () =>
      runs
        .filter((run: any) => {
          if (filters.status.length && !filters.status.includes(run.status)) {
            return false;
          }

          if (filters.branch.length && !filters.branch.includes(run.branch)) {
            return false;
          }

          return true;
        })
        .slice(0, runsLimit),
    [runs, runsLimit, filters]
  );

  if (!runs?.length) {
    return (
      <>
        <ButtonBar
          left={<Heading level={1}>{project.name}</Heading>}
          right={<ProjectActions data={project} />}
        />
        <Spacer h="1.8rem" />
        <HelpBox>
          <Heading level={2}>Get started</Heading>
          <Spacer h=".6rem" />
          <P>
            There are no report runs recorded on this project yet. To get
            started, trigger a lightkeepr run with the following API key and
            pass the project ID in. See some examples below or see our{" "}
            <Link href="/docs/getting-started">
              <a>docs</a>
            </Link>{" "}
            for more details.
          </P>
          <Spacer h="1.6rem" />

          <CodePreview
            code={[
              {
                title: "CLI",
                language: "bash",
                code:
                  `# Set API token\n` +
                  `export LIGHTKEEPR_TOKEN=${project.apiToken}\n\n` +
                  `# Start run and store returned ID in env\n` +
                  `export LIGHTKEEPR_RUN_ID=$(npx lightkeepr start)\n\n` +
                  `# Run lighthouse reports\n` +
                  `npx lightkeepr report --url=https://www.julianburr.de/til\n` +
                  `npx lightkeepr report --url=https://www.julianburr.de/around-the-world\n\n` +
                  `# Finish run\n` +
                  `npx lightkeepr stop`,
              },
              {
                title: "Node",
                language: "javascript",
                code:
                  `const lightkeepr = require('@lightkeepr/node');\n\n` +
                  `// Start run with API token\n` +
                  `const run = await lightkeepr.start({ token: '${project.apiToken}' });\n\n` +
                  `// Run lighthouse reports\n` +
                  `await run.report({ url: 'https://www.julianburr.de/til' });\n` +
                  `await run.report({ url: 'https://www.julianburr.de/around-the-world' });\n\n` +
                  `// Finish run\n` +
                  `await run.stop();`,
                showLineNumbers: true,
              },
              {
                title: "Cypress",
                files: [
                  {
                    language: "javascript",
                    code: `import '@lightkeepr/cypress';`,
                    title: "cypress/support/index.js",
                  },
                  {
                    language: "javascript",
                    code: `// Trigger a report\n` + `cy.lightkeepr();`,
                    title: "In your test file",
                  },
                  {
                    language: "bash",
                    code:
                      `# Run Cypress through lightkeepr instead of directly through the Cypress CLI\n` +
                      `LIGHTKEEPR_TOKEN=${project.apiToken} npx lightkeepr exec -- cypress run`,
                  },
                ],
              },
            ]}
          />
        </HelpBox>
      </>
    );
  }

  return (
    <>
      <ButtonBar
        left={<Heading level={1}>{project.name}</Heading>}
        right={<ProjectActions data={project} />}
      />
      <Spacer h="1.8rem" />

      {runs?.[0] && !runs[0].commitMessage && (
        <>
          <Spacer h=".8rem" />
          <Hint>
            It looks like you don't have a commit message defined on the latest
            run. To make it easier to distinguish your runs, adding a title like
            a commit message can help. Learn more how do to that in the
            documentation.
          </Hint>
          <Spacer h="2.4rem" />
        </>
      )}

      <ButtonBar
        left={<Heading level={2}>Runs</Heading>}
        right={
          <ActionMenu items={filterItems}>
            {(props) => (
              <Button
                intent={
                  filters.status.length || filters.branch.length
                    ? "primary"
                    : "secondary"
                }
                {...props}
              >
                Filter
              </Button>
            )}
          </ActionMenu>
        }
      />
      <Spacer h=".8rem" />
      <List
        items={filteredRuns}
        Item={RunListItem}
        loadMore={
          runsLimit < runs.length
            ? () => setRunsLimit((limit) => limit + 10)
            : undefined
        }
      />

      {!!project.pages?.length || !!project.userFlows?.length ? (
        <>
          <Spacer h="3.2rem" />

          <Heading level={2}>Pages &amp; user flows</Heading>
          <Container>
            <Small grey>
              Below you can find the different unique pages and user flows found
              in all runs and their last status. Click on an item to get to its
              latest instance.
            </Small>
          </Container>

          {!!project.pages?.length && (
            <>
              <Spacer h="1.6rem" />
              <GroupHeading>Pages</GroupHeading>
              <Spacer h=".2rem" />
              <List items={project.pages || []} Item={PageListItem} />
            </>
          )}

          {!!project.userFlows?.length && (
            <>
              <Spacer h="1.6rem" />
              <GroupHeading>User flows</GroupHeading>
              <Spacer h=".2rem" />
              <List items={project.userFlows || []} Item={PageListItem} />
            </>
          )}
        </>
      ) : null}
    </>
  );
}

export default function ProjectDetails() {
  return (
    <Auth>
      <AppLayout>
        <Suspense fallback={<Loader />}>
          <Content />
        </Suspense>
      </AppLayout>
    </Auth>
  );
}
