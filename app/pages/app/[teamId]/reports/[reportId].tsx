import "src/utils/firebase";

import { useRouter } from "next/router";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import styled from "styled-components";
import Link from "next/link";
import classNames from "classnames";

import { useDocument } from "src/@packages/firebase";
import { CATEGORIES } from "src/utils/audits";
import { useToast } from "src/hooks/use-toast";
import { useConfirmationDialog } from "src/hooks/use-dialog";
import { AppLayout } from "src/layouts/app";
import { Auth } from "src/components/auth";
import { Heading, Small } from "src/components/text";
import { Spacer } from "src/components/spacer";
import { Loader } from "src/components/loader";
import { ReportDetails } from "src/components/report-details";
import { Suspense } from "src/components/suspense";
import { ButtonBar } from "src/components/button-bar";
import { ActionMenu } from "src/components/action-menu";
import { ActionButton } from "src/components/button";

const db = getFirestore();

const WrapSummary = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.4rem 1.2rem;
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

const SummaryItem = styled.div<{ value: number; hasRun?: boolean }>`
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
  background: ${(props) =>
    !props.hasRun
      ? `var(--sol--palette-sand-100)`
      : props.value < 50
      ? `var(--sol--palette-red-50)`
      : props.value < 90
      ? `var(--sol--palette-yellow-50)`
      : `var(--sol--palette-green-50)`};

  @media (min-width: 800px) {
    width: 11rem;
    height: 11rem;
    border: 0 none;
  }

  &:hover,
  &:focus {
    background: ${(props) =>
      !props.hasRun
        ? `var(--sol--palette-sand-200)`
        : props.value < 50
        ? `var(--sol--palette-red-100)`
        : props.value < 90
        ? `var(--sol--palette-yellow-100)`
        : `var(--sol--palette-green-100)`};
  }

  &.active:hover,
  &.active:focus,
  &.active {
    background: ${(props) =>
      !props.hasRun
        ? `var(--sol--palette-sand-400)`
        : props.value < 50
        ? `var(--sol--palette-red-200)`
        : props.value < 90
        ? `var(--sol--palette-yellow-200)`
        : `var(--sol--palette-green-200)`};
  }

  &:before,
  &:after,
  & span:before,
  & span:after {
    content: " ";
    position: absolute;
    color: ${(props) =>
      !props.hasRun
        ? `var(--sol--palette-sand-500)`
        : props.value < 50
        ? `var(--sol--palette-red-500)`
        : props.value < 90
        ? `var(--sol--palette-yellow-500)`
        : `var(--sol--palette-green-500)`};
    border-width: 0.4rem;
    border-style: none;
    pointer-events: none;

    @media (min-width: 800px) {
      border-width: 0.6rem;
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

  & span:before {
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

  & span:after {
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

function Content() {
  const router = useRouter();

  const toast = useToast();
  const confirmationDialog = useConfirmationDialog();

  const reportRef = doc(db, "reports", router.query.reportId!);
  const report = useDocument(reportRef, { fetch: router.isReady });

  return (
    <>
      <ButtonBar
        left={<Heading level={1}>{report.name}</Heading>}
        right={
          <ActionMenu
            placement="bottom-end"
            items={[
              {
                label: "Delete report",
                onClick: () =>
                  confirmationDialog.open({
                    message:
                      "Are you sure you want to delete this report? This can not be reverted.",
                    confirmLabel: "Delete report",
                    intent: "danger",
                    onConfirm: async () => {
                      router.push(
                        `/app/${router.query.teamId}/runs/${report.run.id}`
                      );
                      await deleteDoc(reportRef);
                      toast.show({
                        message: "Report has been deleted successfully",
                      });
                    },
                  }),
                intent: "danger",
              },
            ]}
          >
            {(props) => <ActionButton intent="secondary" {...props} />}
          </ActionMenu>
        }
      />

      {report.url && report.url !== report.name && (
        <Small grey>{report.url}</Small>
      )}

      <Spacer h="1.2rem" />

      <WrapSummary>
        {CATEGORIES.map((item) => {
          const { category, ...q } = router.query;

          const hasRun =
            report.summary?.[item.id] || report.summary?.[item.id] === 0;
          const score = hasRun
            ? Math.round(report.summary?.[item.id] * 100)
            : 0;

          return (
            <Link
              key={item.id}
              href={{
                query: {
                  ...q,
                  ...(category === item.id ? {} : { category: item.id }),
                },
              }}
            >
              <a>
                <Label>{item.label}</Label>
                <SummaryItem
                  hasRun={hasRun}
                  value={score}
                  className={classNames({
                    active: router.query.category === item.id,
                  })}
                >
                  <Score>{hasRun ? score : "n/a"}</Score>
                </SummaryItem>
              </a>
            </Link>
          );
        })}
      </WrapSummary>
      <Spacer h="1.6rem" />

      <Suspense fallback={<Loader />}>
        <ReportDetails
          reportId={router.query.reportId!}
          categoryId={router.query.category}
        />
      </Suspense>
    </>
  );
}

export default function ReportDetailsPage() {
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
