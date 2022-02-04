import classNames from "classnames";
import Head from "next/head";
import { lazy, useState } from "react";
import styled from "styled-components";

import { CodePreview } from "src/components/code-preview";
import { Hero } from "src/components/homepage/hero";
import { Highlight } from "src/components/homepage/highlight";
import { Section, SectionContent } from "src/components/homepage/section";
import { SEO } from "src/components/seo";
import { Suspense } from "src/components/suspense";
import { WebsiteLayout } from "src/layouts/website";

import BubbleSvg from "src/assets/icons/website/bubble-chat.svg";
import BulbSvg from "src/assets/icons/website/bulb.svg";
import CompareSvg from "src/assets/icons/website/divide.svg";
import ExtensionSvg from "src/assets/icons/website/extension.svg";
import UsersSvg from "src/assets/icons/website/rocket.svg";
import BellSvg from "src/assets/icons/website/snooze.svg";

const AppPreview = lazy(() =>
  import("src/components/app-preview").then(({ AppPreview }) => ({
    default: AppPreview,
  }))
);

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
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.2rem;
  width: 100%;
  max-width: 30rem;
  margin: 4.2rem auto 0;

  @media (min-width: 600px) {
    gap: 1.6rem;
    grid-template-columns: 1fr 1fr;
    max-width: 66rem;
  }

  @media (min-width: 1000px) {
    grid-template-columns: 1fr 1fr 1fr;
    max-width: none;
  }
`;

const Feature = styled.div`
  background: var(--sol--palette-sand-50);
  text-align: left;
  border-radius: 0.8rem;
  padding: 2.8rem 2.4rem 3.2rem;

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

const Screenshots = styled.div`
  width: 100%;
  max-width: 89rem;
  height: 60rem;
  margin: 3.6rem auto 0;
  position: relative;
`;

const AppContainer = styled.div`
  width: calc(100% / 0.7);
  height: calc(100% / 0.7);
  background: #fff;
  transform: scale(0.7);
  transform-origin: 0 0;
  box-shadow: 0.4rem 0 1.6rem rgba(0, 0, 0, 0.1);
  border-radius: 1.2rem;
  position: absolute;
  inset: 0;
  text-align: left;
  overflow: hidden;
  pointer-events: none;

  h1,
  h2,
  h3,
  h4 {
    margin: 0;
  }

  &:nth-child(1) {
    transform: rotate(-1deg) scale(0.7);
    opacity: 0.6;
    top: -0.6rem;
    box-shadow: 0.4rem 0 1.6rem rgba(0, 0, 0, 0.1);
  }

  &:nth-child(2) {
    transform: rotate(1deg) scale(0.7);
    opacity: 0.8;
    top: 0.3rem;
    box-shadow: 0.4rem 0 1.6rem rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 800px) {
    &:nth-child(1) {
      transform: rotate(-0.8deg) scale(0.7);
      top: -0.4rem;
    }

    &:nth-child(2) {
      transform: rotate(0.8deg) scale(0.7);
    }
  }

  @media (min-width: 1050px) {
    width: 124rem;
    transform: scale(calc(89 / 124));
    height: calc(60rem / calc(89 / 124));

    &:nth-child(1) {
      top: -0.4rem;
      transform: rotate(-0.8deg) scale(calc(89 / 124));
    }

    &:nth-child(2) {
      transform: rotate(0.8deg) scale(calc(89 / 124));
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
        <SEO />
      </Head>

      <Hero>Get the most value out of Lighthouse</Hero>

      <Section>
        <SectionContent>
          <h2>
            Easily <Highlight>consume</Highlight> and{" "}
            <Highlight>analyse</Highlight> your Lighthouse reports
          </h2>
          <p>
            Keep track of your scores over time. The intuitive UI helps you to
            quickly see potential opportunities for improvements and work
            together with your team to action them.
          </p>
        </SectionContent>
        <Screenshots>
          <AppContainer />
          <AppContainer />
          <AppContainer>
            <Suspense fallback={null}>
              <AppPreview />
            </Suspense>
          </AppContainer>
        </Screenshots>
      </Section>

      <Section>
        <SectionContent>
          <h2>
            <Highlight>Quick &amp; easy</Highlight> to get started
          </h2>
          <p>
            Lighthouse is made from developers for developers. Simply create a
            free account, set up your project, and you're ready to start sending
            reports. Our CLI tools and helper libraries make integration into
            your existing workflows a breeze.
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
                title: "Cypress",
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
          <h2>More than just performance</h2>
          <p>
            Lighthouse has become synonymous with performance auditing, but it's
            actually so much more. Get insights into your sites
            <Highlight>accessibility</Highlight>, current{" "}
            <Highlight>best practices</Highlight> in the web industry,{" "}
            <Highlight>search engine optimisation</Highlight> and{" "}
            <Highlight>progressive web app</Highlight> setup and improvements.
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
            Detect changes and <Highlight>manually review</Highlight> any
            regressions
          </h2>
          <p>
            Lightkeepr automatically detects regressions and checks performance
            budgets if defined. You can also set project specific targets. When
            reports fail, easily review and manually approve them.
          </p>
        </SectionContent>
      </Section>

      <Section id="features">
        <SectionContent>
          <h2>Some more features...</h2>
        </SectionContent>
        <Features>
          <Feature>
            <UsersSvg />
            <h3>Teams &amp; projects</h3>
            <p>
              Keep things organised by setting up teams and projects, invite
              your team members and help them easily find the information they
              need.
            </p>
          </Feature>
          <Feature>
            <CompareSvg />
            <h3>View &amp; compare</h3>
            <p>
              Not only keep track of your scores over time, but also easily
              compare reports to see what audits changed that might have caused
              changes. Finding and fixing regressions was never easier.
            </p>
          </Feature>
          <Feature>
            <BulbSvg />
            <h3>Smart summaries</h3>
            <p>
              Beyond the reports themselves, Lightkeepr will try to pull out the
              biggest opportunities and most relevant metrices to give you smart
              and more importantly actionable summaries.
            </p>
          </Feature>
          <Feature>
            <BubbleSvg />
            <h3>Collaborate</h3>
            <p>
              Work together, add comments to reports, specific audits or changes
              in your score history to make it easier for the team to figure out
              what the right next steps are.
            </p>
          </Feature>
          <Feature>
            <ExtensionSvg />
            <h3>Integrate</h3>
            <p>
              Lightkeepr is meant to fit into your workflow. With integrations
              for popular tools like Slack, Jira, etc., making it part of your
              usual processes and tools becomes easy.
            </p>
          </Feature>
          <Feature>
            <BellSvg />
            <h3>Stay up-to-date</h3>
            <p>
              Lightkeepr lets you define what you care about. Easily set up
              notifications the way it makes sense for your specific role and
              use case and stay on top of what's going on.
            </p>
          </Feature>
        </Features>
      </Section>
    </WebsiteLayout>
  );
}
