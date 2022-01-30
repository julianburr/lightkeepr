import "src/utils/firebase";

import Link from "next/link";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { useCollection, useDocument } from "src/@packages/firebase";
import { AppLayout } from "src/layouts/app";
import { Auth } from "src/components/auth";
import { List } from "src/components/list";
import { Spacer } from "src/components/spacer";
import { Heading, P } from "src/components/text";
import { CodePreview } from "src/components/code-preview";
import { HelpBox } from "src/components/help-box";
import { Suspense } from "src/components/suspense";

import { RunListItem } from "src/list-items/run";

const db = getFirestore();

const CLI_CODE = (token: string) => `
# Set API token
export LIGHTKEEPR_TOKEN=${token}

# Start run and store returned ID in env
export LIGHTKEEPR_RUN_ID=$(npx lightkeepr start)

# Run lighthouse reports
npx lightkeepr report --url=https://www.julianburr.de/til
npx lightkeepr report --url=https://www.julianburr.de/around-the-world

# Finish run
npx lightkeepr stop
`;

const NODE_CODE = (token: string) => `
const lightkeepr = require('@lightkeepr/node');

// Start run with API token
const run = await lightkeepr.start({ token: '${token}' });

// Run lighthouse reports
await lightkeepr.report({ url: 'https://www.julianburr.de/til', runId: run.id });
await lightkeepr.report({ url: 'https://www.julianburr.de/around-the-world', runId: run.id });

// Finish run
await lightkeepr.stop();
`;

const CYPRESS_CODE_SUPPORT = () => `
import '@lightkeepr/cypress';
`;

const CYPRESS_CODE_TEST = () => `
// Trigger a report
cy.lightkeepr();
`;

const CYPRESS_CODE_RUN = (token: string) => `
# Run Cypress through lightkeepr instead of directly through the Cypress CLI
LIGHTKEEPR_TOKEN=${token} npx lightkeepr exec -- cypress run 
`;

function RunsList() {
  const router = useRouter();

  const projectRef = doc(db, "projects", router.query.projectId!);
  const project = useDocument(projectRef);

  const runs = useCollection(
    query(
      collection(db, "runs"),
      where("project", "==", projectRef),
      orderBy("startedAt", "desc")
    ),
    { key: `${router.query.projectId}/runs` }
  );

  if (!runs?.length) {
    return (
      <HelpBox>
        <Heading level={2}>Get started</Heading>
        <Spacer h=".6rem" />
        <P>
          There are no report runs recorded on this project yet. To get started,
          trigger a lightkeepr run with the following API key and pass the
          project ID in. See some examples below or see our{" "}
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
              code: CLI_CODE(project.apiToken),
            },
            {
              title: "Node",
              language: "javascript",
              code: NODE_CODE(project.apiToken),
              showLineNumbers: true,
            },
            {
              title: "Cypress",
              files: [
                {
                  language: "javascript",
                  code: CYPRESS_CODE_SUPPORT(),
                  title: "cypress/support/index.js",
                },
                {
                  language: "javascript",
                  code: CYPRESS_CODE_TEST(),
                  title: "In your test file",
                },
                {
                  language: "bash",
                  code: CYPRESS_CODE_RUN(project.apiToken),
                },
              ],
            },
          ]}
        />
      </HelpBox>
    );
  }

  return (
    <>
      <Heading level={2}>Suggested improvements</Heading>
      <Spacer h=".6rem" />
      <P>Suggestions are not implemented yet.</P>
      <Spacer h="1.8rem" />

      <Heading level={2}>Runs</Heading>
      <Spacer h="1.2rem" />
      <List items={runs} Item={RunListItem} />
    </>
  );
}

export default function ProjectDetails() {
  const router = useRouter();

  const project = useDocument(doc(db, "projects", router.query.projectId!));

  return (
    <Auth>
      <AppLayout>
        <Heading level={1}>{project.name}</Heading>
        <Spacer h="1.8rem" />

        <Suspense fallback={null}>
          <RunsList />
        </Suspense>
      </AppLayout>
    </Auth>
  );
}
