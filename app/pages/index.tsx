import { useState } from "react";
import styled from "styled-components";
import classNames from "classnames";
import Head from "next/head";

import { WebsiteLayout } from "src/layouts/website";
import { Hero } from "src/components/homepage/hero";
import { Section, SectionContent } from "src/components/homepage/section";
import { Highlight } from "src/components/homepage/highlight";

import UsersSvg from "src/assets/icons/website/rocket.svg";
import ChatSvg from "src/assets/icons/website/bubble-chat.svg";
import BellSvg from "src/assets/icons/website/snooze.svg";
import BulbSvg from "src/assets/icons/website/bulb.svg";
import CompareSvg from "src/assets/icons/website/divide.svg";
import ReadSvg from "src/assets/icons/website/read.svg";
import { CodePreview } from "src/components/code-preview";

const Screenshots = styled.div`
  width: 90%;
  padding: 50% 0 0;
  background: var(--sol--palette-sand-500);
  margin: 3.6rem auto 0;
`;

const Scores = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin: 3.2rem 0 4.8rem;
  gap: 0.8rem;

  @media (min-width: 800px) {
    gap: 1.2rem;
  }
`;

const Score = styled.button`
  height: 11rem;
  width: 11rem;
  border: 0 none;
  border-radius: 0.8rem;
  background: var(--sol--palette-sand-300);
  font-family: "Playfair Display";
  transition: background 0.2s;

  @media (min-width: 800px) {
    height: 13rem;
    width: 13rem;
  }

  &:focus,
  &:hover {
    background: var(--sol--palette-sand-400);
  }

  &.active,
  &.active,
  :focus,
  &.active:hover {
    background: var(--sol--palette-sand-600);
  }
`;

const Audits = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  opacity: 0.2;
`;

const Audit = styled.span<{ rotate: number }>`
  display: flex;
  background: var(--sol--palette-sand-600);
  padding: 0.8rem;
  white-space: nowrap;
  z-index: 0;
  font-family: "Playfair Display";
  border-radius: var(--sol--border-radius-s);
  transform: ${(props) => `rotate(${props.rotate || 0}deg)`};

  @media (min-width: 800px) {
    padding: 1.2rem;
  }
`;

const CodeExamples = styled.div`
  width: 100%;
  max-width: 54rem;
  margin: 3.6rem auto 0;
`;

const Features = styled.div`
  margin: 4.2rem 0 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.2rem;

  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1.6rem;
  }
`;

const Feature = styled.div`
  background: var(--sol--palette-sand-50);
  text-align: left;
  border-radius: 0.8rem;
  padding: 2.8rem 2.4rem;

  @media (min-width: 800px) {
    padding: 3.6rem 3.2rem;
  }

  section:nth-child(odd) & {
    background: var(--sol--color-white);
  }

  h3 {
    margin: 1.8rem 0 1.2rem;
  }

  svg {
    height: 3.2rem;
    width: auto;
    color: var(--sol--palette-sand-400);

    @media (min-width: 800px) {
      height: 4rem;
    }
  }
`;

const auditExamples = {
  performance: [
    "First contentful paint",
    "Largest contentful paint",
    "Cumulative layout shift",
    "Time to interactive",
    "Speed index",
    "Render blocking resources",
    "Unused Javascript",
    "Unused CSS",
    "Excessive DOM size",
    "Javascript execution time",
  ],
  accessibility: [
    "Aria attributes match their roles",
    "Roles are valid",
    "Buttons have accessible names",
    "Background and foreground have sufficient contrast",
    "Document has title",
    "Links have discernible name",
    "Image elements have alt attributes",
    "Form elements have associated labels",
  ],
  "best-practices": [
    "HTTPS usage",
    "Permission requests on page load",
    "Check for known security vulnerabilities",
    "Images have appropriate resutions",
    "Deprecated APIs",
    "Valid source maps",
  ],
  seo: [
    "Document has a title attribute",
    "Document has meta description",
    "Links have descriptive text",
    "Links are crawlable",
    "robot.txt is valid",
    "Document uses legible font sizes",
    "Tap targets are sized appropriately",
  ],
  pwa: [
    "Service worker registration",
    "Splash screen configured",
    "Set theme color for address bar",
    "Manifest is valid",
    "Content is sized correctly for viewport",
    "Provides valid apple touch icon",
  ],
};

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function HomePage() {
  const [auditCategory, setAuditCategory] =
    useState<keyof typeof auditExamples>("accessibility");

  return (
    <WebsiteLayout>
      <Head>
        <title>
          Lightkeepr — Keeping track & taking advantage of Lighthouse reports
          made easy
        </title>
      </Head>

      <Hero />

      <Section>
        <SectionContent>
          <h2>
            <Highlight>Easy &amp; quick</Highlight> to get started
          </h2>
          <p>
            Simply create a free Lightkeepr account and you're ready to go. You
            can send reports from your existing workflows, no additional setup
            needed.
          </p>
        </SectionContent>
        <Screenshots />
      </Section>

      <Section>
        <SectionContent>
          <h2>More than just performance</h2>
          <p>
            Lighthouse has become synonoumous with performance monitoring. But
            it's actually so much more. Keep track of{" "}
            <Highlight>accessibility</Highlight>,{" "}
            <Highlight>best practices</Highlight> in the web industrie,{" "}
            <Highlight>search engine optimisation</Highlight> and{" "}
            <Highlight>PWA</Highlight> optimisations. And get quick optimisation
            suggestions relevant to your reports.
          </p>
        </SectionContent>
        <Scores>
          <Score
            onClick={() => setAuditCategory("performance")}
            className={classNames({ active: auditCategory === "performance" })}
          >
            Performance
          </Score>
          <Score
            onClick={() => setAuditCategory("accessibility")}
            className={classNames({
              active: auditCategory === "accessibility",
            })}
          >
            Accessibility
          </Score>
          <Score
            onClick={() => setAuditCategory("best-practices")}
            className={classNames({
              active: auditCategory === "best-practices",
            })}
          >
            Best practices
          </Score>
          <Score
            onClick={() => setAuditCategory("seo")}
            className={classNames({ active: auditCategory === "seo" })}
          >
            SEO
          </Score>
          <Score
            onClick={() => setAuditCategory("pwa")}
            className={classNames({ active: auditCategory === "pwa" })}
          >
            PWA
          </Score>
        </Scores>

        <Audits>
          {auditCategory &&
            auditExamples[auditCategory] &&
            auditExamples[auditCategory]?.map?.((label) => (
              <Audit key={label} rotate={random(-2, 2)}>
                {label}
              </Audit>
            ))}
        </Audits>
      </Section>

      <Section>
        <SectionContent>
          <h2>
            From <Highlight>developers</Highlight> for developers
          </h2>
          <p>
            Lightkeepr was created from developers for developers. It's meant to
            fix the problems encountered when having to do all of this manually.
            Our helper libraries will make it easy for you to get the reports
            coming in. You're working with Node, Cypress, or prefer CLI tools?
            No problem! Lightkeepr got you covered.
          </p>
        </SectionContent>
        <CodeExamples>
          <CodePreview
            code={[
              {
                title: "CLI",
                language: "bash",
                code:
                  `npx lightkeepr start\n` +
                  `npx lightkeepr report --url=https://www.julianburr.de\n` +
                  `npx lightkeepr stop`,
              },

              {
                title: "Node",
                files: [
                  {
                    title: "Install node package",
                    language: "bash",
                    code: "yarn add @lightkeepr/node",
                  },
                  {
                    title: "In your node app...",
                    language: "javascript",
                    code:
                      `const lightkeepr = require('@lightkeepr/node');\n\n` +
                      `const run = await lightkeepr.startRun();\n` +
                      `await run.report('https://wwww.julianburr.de');\n` +
                      `await run.stopRun();`,
                  },
                ],
              },

              {
                title: "Cyress",
                files: [
                  {
                    title: "In your cypress/support/index.js",
                    language: "javascript",
                    code: `import '@lightkeepr/cypress';`,
                  },
                  {
                    title: "In your cypress test",
                    language: "javascript",
                    code: `cy.lightkeepr()`,
                  },
                  {
                    title: "Run cypress through Lightkeepr",
                    language: "bash",
                    code: "npx lightkeepr exec -- cypress run",
                  },
                ],
              },
            ]}
          />
        </CodeExamples>
      </Section>

      <Section>
        <SectionContent>
          <h2>
            <Highlight>Automate</Highlight> your Lighthouse reports
          </h2>
          <p>
            Manually collecting, analysing and comparing Lighthouse reports is
            painful and impossible at scale. Automate the process with
            Lightkeepr and consume the information through its intuitive UI.
          </p>
        </SectionContent>
      </Section>

      <Section id="features">
        <SectionContent>
          <h2>Some other features...</h2>
        </SectionContent>
        <Features>
          <Feature>
            <UsersSvg />
            <h3>Teams &amp; projects</h3>
            <p>
              Lightkeepr let's you manage your projects with ease. Invite all
              the team members to view and analyse the Lighthouse reports.
            </p>
          </Feature>
          <Feature>
            <ChatSvg />
            <h3>Collaborate &amp; integrate</h3>
            <p>
              Add comments to specific audits and integrate with your favorite
              tools like Slack or JIRA to make the process as painless as
              seemless.
            </p>
          </Feature>
          <Feature>
            <BellSvg />
            <h3>You define what matters</h3>
            <p>
              Stay up-to-date with relevant configurable notifications. Want to
              know when scores go down? When reports fail the set up budgets? No
              problem with Lightkeepr.
            </p>
          </Feature>
          <Feature>
            <BulbSvg />
            <h3>Smart summaries</h3>
            <p>
              Besides the whole content of the Lighthouse reports, Lightkeepr
              also tries to give you a relevant summary with optimisation
              suggestions.
            </p>
          </Feature>
          <Feature>
            <CompareSvg />
            <h3>Compare reports</h3>
            <p>
              Easily compare reports to previous ones and quickly find
              differences in the audits and potential causes for regressions.
            </p>
          </Feature>
          <Feature>
            <ReadSvg />
            <h3>Be in control</h3>
            <p>
              Lightkeepr makes it an ease to review failed reports, manually
              check why they failed and approve them if the changes are
              expected.
            </p>
          </Feature>
        </Features>
      </Section>
    </WebsiteLayout>
  );
}
