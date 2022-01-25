import "src/utils/firebase";

import { Suspense } from "react";
import { useRouter } from "next/router";
import { doc, getFirestore } from "firebase/firestore";
import styled from "styled-components";

import { useDocument } from "src/@packages/firebase";
import { useSuspense } from "src/@packages/suspense";
import { api } from "src/utils/api-client";
import { AppLayout } from "src/layouts/app";
import { Auth } from "src/components/auth";
import { Heading } from "src/components/text";
import { Spacer } from "src/components/spacer";
import { Loader } from "src/components/loader";
import { BackLink } from "src/components/back-link";

const db = getFirestore();

const WrapSummary = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1.2rem;
`;

const SummaryItem = styled.button<{ value: number }>`
  width: 12rem;
  height: 12rem;
  border: 0 none;
  border-radius: var(--sol--border-radius-s);
  transition: background 0.2s;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Playfair Display";
  position: relative;
  line-height: 1;
  background: ${(props) =>
    props.value < 50
      ? `var(--sol--palette-red-50)`
      : props.value < 90
      ? `var(--sol--palette-yellow-50)`
      : `var(--sol--palette-green-50)`};

  @media (min-width: 800px) {
    width: 13rem;
    height: 13rem;
    border: 0 none;
  }

  @media (min-width: 1024px) {
    width: 14rem;
    height: 14rem;
    border: 0 none;
  }

  &:hover,
  &:focus {
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
    border-top-style: solid;
    border-right-style: solid;
    border-top-right-radius: var(--sol--border-radius-s);
  }

  &:after {
    top: 50%;
    right: 0;
    bottom: ${(props) =>
      `${50 - (Math.min(Math.max(props.value - 25), 12.5) / 12.5) * 50}%;`};
    left: ${(props) =>
      `${100 - (Math.min(Math.max(props.value - 37.5), 12.5) / 12.5) * 50}%`};
    border-right-style: solid;
    border-bottom-style: solid;
    border-bottom-right-radius: var(--sol--border-radius-s);
  }

  & label:before {
    bottom: 0;
    right: 50%;
    left: ${(props) =>
      `${50 - (Math.min(Math.max(props.value - 50), 12.5) / 12.5) * 50}%;`};
    top: ${(props) =>
      `${100 - (Math.min(Math.max(props.value - 62.5), 12.5) / 12.5) * 50}%`};
    border-bottom-style: solid;
    border-left-style: solid;
    border-bottom-left-radius: var(--sol--border-radius-s);
  }

  & label:after {
    bottom: 50%;
    left: 0;
    top: ${(props) =>
      `${50 - (Math.min(Math.max(props.value - 75), 12.5) / 12.5) * 50}%;`};
    right: ${(props) =>
      `${100 - (Math.min(Math.max(props.value - 87.5), 12.5) / 12.5) * 50}%`};
    border-left-style: solid;
    border-top-style: solid;
    border-top-left-radius: var(--sol--border-radius-s);
  }
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 400;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.6);
`;

const Score = styled.span`
  font-size: 4.6rem;
  margin-top: -0.4rem;

  @media (min-width: 800px) {
    font-size: 5.4rem;
  }
`;

function ReportData() {
  const router = useRouter();

  const data = useSuspense(
    () => api.get(`/api/reports/${router.query.reportId}`),
    { key: `report/${router.query.reportId}` }
  );

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export default function ReportDetails() {
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
          <SummaryItem value={report.summary?.performance * 100}>
            <Label>Performance</Label>
            <Score>{report.summary?.performance * 100}</Score>
          </SummaryItem>
          <SummaryItem value={report.summary?.accessibility * 100}>
            <Label>Accessibility</Label>
            <Score>{report.summary?.accessibility * 100}</Score>
          </SummaryItem>
          <SummaryItem value={report.summary?.["best-practices"] * 100}>
            <Label>Best practices</Label>
            <Score>{report.summary?.["best-practices"] * 100}</Score>
          </SummaryItem>
          <SummaryItem value={report.summary?.seo * 100}>
            <Label>SEO</Label>
            <Score>{report.summary?.seo * 100}</Score>
          </SummaryItem>
          <SummaryItem value={report.summary?.pwa * 100}>
            <Label>PWA</Label>
            <Score>{report.summary?.pwa * 100}</Score>
          </SummaryItem>
        </WrapSummary>
      </AppLayout>

      <Suspense fallback={<Loader />}>
        <ReportData />
      </Suspense>
    </Auth>
  );
}
