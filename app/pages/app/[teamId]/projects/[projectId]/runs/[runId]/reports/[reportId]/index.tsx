import "src/utils/firebase";

import { Suspense } from "react";
import { useRouter } from "next/router";
import { doc, getFirestore } from "firebase/firestore";
import styled from "styled-components";
import Link from "next/link";
import classNames from "classnames";

import { useDocument } from "src/@packages/firebase";
import { AppLayout } from "src/layouts/app";
import { Auth } from "src/components/auth";
import { Heading } from "src/components/text";
import { Spacer } from "src/components/spacer";
import { Loader } from "src/components/loader";
import { BackLink } from "src/components/back-link";
import { ReportDetails } from "src/components/report-details";

const db = getFirestore();

const WrapSummary = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1.2rem;
  font-family: "Playfair Display";
  text-align: center;
  margin: 1.2rem 0;
  padding: 1.2rem 0 1.6rem;
  background: #fff;
  z-index: 10;

  a {
    color: inherit;

    &:hover,
    &:focus {
      color: inherit;
      text-decoration: none;
    }
  }
`;

const SummaryItem = styled.div<{ value: number }>`
  width: 8rem;
  height: 8rem;
  border: 0 none;
  border-radius: var(--sol--border-radius-s);
  transition: background 0.2s;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  line-height: 1;
  background: var(--sol--palette-sand-50);

  @media (min-width: 800px) {
    width: 11rem;
    height: 11rem;
    border: 0 none;
  }

  &:hover,
  &:focus {
    background: ${(props) =>
      props.value < 50
        ? `var(--sol--palette-red-50)`
        : props.value < 90
        ? `var(--sol--palette-yellow-50)`
        : `var(--sol--palette-green-50)`};
  }

  &.active,
  &.active:hover,
  &.active:focus {
    background: ${(props) =>
      props.value < 50
        ? `var(--sol--palette-red-100)`
        : props.value < 90
        ? `var(--sol--palette-yellow-100)`
        : `var(--sol--palette-green-100)`};
  }

  &:before,
  &:after,
  & label:before,
  & label:after {
    content: " ";
    position: absolute;
    color: ${(props) =>
      props.value < 50
        ? `var(--sol--palette-red-500)`
        : props.value < 90
        ? `var(--sol--palette-yellow-500)`
        : `var(--sol--palette-green-500)`};
    border-width: 0.6rem;
    border-style: none;
    pointer-events: none;

    @media (min-width: 800px) {
      border-width: 0.8rem;
    }
  }

  &:before {
    top: 0;
    left: 50%;
    right: ${(props) => `${50 - (Math.min(props.value, 12.5) / 12.5) * 50}%;`};
    bottom: ${(props) =>
      `${(Math.min(Math.max(props.value - 12.5, 0), 12.5) / 12.5) * 50}%`};
    border-top-style: ${(props) => (props.value <= 0 ? "none" : "solid")};
    border-right-style: ${(props) => (props.value <= 12.5 ? "none" : "solid")};
    border-top-right-radius: ${(props) =>
      props.value <= 12.5 ? "0" : "var(--sol--border-radius-s)"};
  }

  &:after {
    top: 50%;
    right: 0;
    bottom: ${(props) =>
      `${50 - (Math.min(Math.max(props.value - 25, 0), 12.5) / 12.5) * 50}%;`};
    left: auto;
    width: ${(props) =>
      `${(Math.min(Math.max(props.value - 37.5, 0), 12.5) / 12.5) * 50}%`};
    border-right-style: ${(props) => (props.value <= 25 ? "none" : "solid")};
    border-bottom-style: ${(props) => (props.value <= 37.5 ? "none" : "solid")};
    border-bottom-right-radius: ${(props) =>
      props.value <= 37.5 ? "0" : "var(--sol--border-radius-s)"};
  }

  & label:before {
    bottom: 0;
    right: 50%;
    left: ${(props) =>
      `${50 - (Math.min(Math.max(props.value - 50, 0), 12.5) / 12.5) * 50}%;`};
    top: auto;
    height: ${(props) =>
      `${(Math.min(Math.max(props.value - 62.5, 0), 12.5) / 12.5) * 50}%`};
    border-bottom-style: ${(props) => (props.value <= 50 ? "none" : "solid")};
    border-left-style: ${(props) => (props.value <= 62.5 ? "none" : "solid")};
    border-bottom-left-radius: ${(props) =>
      props.value <= 62.5 ? "0" : "var(--sol--border-radius-s)"};
  }

  & label:after {
    bottom: 50%;
    left: 0;
    top: ${(props) =>
      `${50 - (Math.min(Math.max(props.value - 75, 0), 12.5) / 12.5) * 50}%;`};
    right: auto;
    width: ${(props) =>
      `${(Math.min(Math.max(props.value - 87.5, 0), 12.5) / 12.5) * 50}%`};
    border-left-style: ${(props) => (props.value <= 75 ? "none" : "solid")};
    border-top-style: ${(props) => (props.value <= 87.5 ? "none" : "solid")};
    border-top-left-radius: ${(props) =>
      props.value <= 87.5 ? "0" : "var(--sol--border-radius-s)"};
  }
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 400;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.6);
`;

const Score = styled.span`
  font-size: 3.6rem;
  margin-top: -0.8rem;

  @media (min-width: 800px) {
    font-size: 4.2rem;
  }
`;

export default function Report() {
  const router = useRouter();

  const reportRef = doc(db, "reports", router.query.reportId!);
  const report = useDocument(reportRef);

  return (
    <Auth>
      <AppLayout>
        <BackLink href="/">Back to run overview</BackLink>
        <Heading level={1}>Report: {report.name}</Heading>
        <Spacer h="1.6rem" />

        <WrapSummary>
          {[
            { label: "Performance", key: "performance" },
            { label: "Accessbility", key: "accessibility" },
            { label: "Best practices", key: "best-practices" },
            { label: "SEO", key: "seo" },
            { label: "PWA", key: "pwa" },
          ].map((item) => (
            <Link
              key={item.key}
              passHref
              href={{
                query: {
                  ...router.query,
                  category:
                    router.query.category === item.key ? undefined : item.key,
                },
              }}
            >
              <a>
                <Label>{item.label}</Label>
                <SummaryItem
                  value={report.summary?.[item.key] * 100}
                  className={classNames({
                    active: router.query.category === item.key,
                  })}
                >
                  <Score>{report.summary?.[item.key] * 100}</Score>
                </SummaryItem>
              </a>
            </Link>
          ))}
        </WrapSummary>
        <Spacer h="3.2rem" />

        <Suspense fallback={<Loader />}>
          <ReportDetails />
        </Suspense>
      </AppLayout>
    </Auth>
  );
}
