import { PropsWithChildren } from "react";
import styled from "styled-components";
import Head from "next/head";

import { WebsiteLayout } from "src/layouts/website";
import { Section, SectionContent } from "src/components/homepage/section";

import CheckSvg from "src/assets/icons/check.svg";
import { Button } from "src/components/button";

const PriceGrid = styled.div`
  width: 100%;
  max-width: 88rem;
  margin: 3.6rem auto 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.2rem;

  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1.6rem;
  }
`;

const PriceItem = styled.div`
  background: var(--sol--palette-sand-50);
  border-radius: 0.8rem;
  padding: 3.2rem;
  width: 100%;
  max-width: 30rem;
  margin: 0 auto;
  text-align: left;
  line-height: 1.3;
  display: flex;
  flex-direction: column;
  height: 100%;

  h2 {
    width: 100%;
    text-align: center;
  }

  ul {
    margin: 1.2rem 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
`;

const Li = styled.li`
  padding: 0 0 0 2.4rem;
  position: relative;

  svg {
    position: absolute;
    top: 0.3rem;
    left: 0;
    height: 1.6rem;
    width: auto;
    color: var(--sol--palette-sand-600);
    stroke-width: 0.3rem;
  }
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 0 2.4rem;
`;

const Price = styled.div`
  margin: 1.6rem 0 2.4rem;
  width: 100%;
  text-align: center;
`;

const Amount = styled.span`
  font-size: 2rem;
  margin: 0 0.4rem 0 0;
`;

function Feature({ children }: PropsWithChildren<Record<never, any>>) {
  return (
    <Li>
      <CheckSvg />
      <span>{children}</span>
    </Li>
  );
}

export default function PricingPage() {
  return (
    <WebsiteLayout>
      <Head>
        <title>Lightkeepr — Pricing</title>
      </Head>

      <Section background="light">
        <SectionContent>
          <h1>Pricing</h1>
          <p>
            The base features are all free. However, in order to cover running
            costs for data storage etc. some advanced features are only
            available in the premium plan.
          </p>
        </SectionContent>

        <PriceGrid>
          <PriceItem>
            <Description>
              <h2>Free</h2>
              <Price>
                <Amount>$0</Amount>
                <span>forever</span>
              </Price>
              <ul>
                <Feature>Unlimited projects</Feature>
                <Feature>Unlimited team members</Feature>
                <Feature>Opportunity highlighting</Feature>
                <Feature>Support for user flows</Feature>
                <Feature>Automatic budget and regression checks</Feature>
                <Feature>Manual approval flow for failed reports</Feature>
                <Feature>Report comparison functionality</Feature>
                <Feature>Daily or weekly email report</Feature>
                <Feature>Last 100 Lighthouse reports retained</Feature>
              </ul>
            </Description>
            <Button intent="primary" href="/auth/sign-up">
              Get started
            </Button>
          </PriceItem>
          <PriceItem>
            <Description>
              <h2>Premium</h2>
              <Price>
                <Amount>$9</Amount>
                <span>/ month</span>
              </Price>
              <ul>
                <Feature>Project integrations (Slack, Jira, etc.)</Feature>
                <Feature>Audit commenting functionality</Feature>
                <Feature>Webhooks</Feature>
                <Feature>No code manual and scheduled reports</Feature>
                <Feature>Last 2000 Lighthouse reports retained</Feature>
              </ul>
            </Description>
            <Button href="/auth/sign-up?plan=premium">Choose</Button>
          </PriceItem>
          <PriceItem>
            <Description>
              <h2>Need more?</h2>
              <p>
                Do you need more resources or have any other special
                requirements? Get in touch and we'll figure something out.
              </p>
            </Description>
            <Button href="mailto:hello@lightkeepr.io">Get in touch</Button>
          </PriceItem>
        </PriceGrid>
      </Section>
    </WebsiteLayout>
  );
}
