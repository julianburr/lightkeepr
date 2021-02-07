import firebase from "firebase/app";
import { Suspense, useMemo } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import pako from "pako";

import { useDocument } from "../../hooks/@firebase";
import { Score } from "../../components/score";
import { Banner } from "../../components/banner";
import { Spacer } from "../../components/spacer";
import { LighthouseReport } from "./components/report";
import { Markdown } from "../../components/markdown";

const ScoresContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1.2rem 0 0;
  border: 0.1rem solid #f4f4f4;
  border-radius: 0.2rem;

  & > * {
    margin-left: 1.2rem;

    &:first-child {
      margin-left: 0;
    }
  }
`;

const ScoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 2rem;
`;

const ScoreLabel = styled.label`
  font-size: 1rem;
  color: #666;
  width: 100%;
  text-align: center;
  margin: 0.3rem 0 0;
  padding: 0;
`;

const PrevScore = styled.div`
  position: absolute;
  right: 0.3rem;
  top: 0.3rem;
`;

function ReportDetails() {
  const { reportId } = useParams<{ reportId: string }>();

  const report = useDocument(
    firebase.firestore().collection("reports").doc(reportId)
  );

  const lighthouse = useMemo(() => {
    const buffer = Buffer.from(report.file, "base64");
    return JSON.parse(pako.inflate(buffer, { to: "string" }));
  }, [report.file]);

  console.log({ lighthouse });

  return (
    <>
      <p>{report.url}</p>

      {!!lighthouse?.runWarnings?.length && (
        <>
          <Banner>
            {lighthouse.runWarnings?.map((warning, index) => (
              <Markdown key={index}>{warning}</Markdown>
            ))}
          </Banner>
          <Spacer height="1.2rem" />
        </>
      )}

      <ScoresContainer>
        {["Performance", "Accessibility", "BestPractices", "Seo", "Pwa"].map(
          (key, index) => {
            const titles = [
              "Performance",
              "Accessibility",
              "Best practices",
              "SEO",
              "PWA",
            ];
            const title = titles[index];
            return (
              <ScoreContainer key={key}>
                <Score
                  score={report[`score${key}`]}
                  size={70}
                  strokeWidth={5}
                />
                <PrevScore>
                  <Score
                    score={report[`prevScore${key}`]}
                    size={30}
                    strokeWidth={4}
                  />
                </PrevScore>
                <ScoreLabel>{title}</ScoreLabel>
              </ScoreContainer>
            );
          }
        )}
      </ScoresContainer>

      <LighthouseReport report={lighthouse} />
    </>
  );
}

export function ReportDetailsScreen() {
  const { reportId } = useParams<{ reportId: string }>();

  return (
    <>
      <h1>Report #{reportId}</h1>
      <Suspense fallback={<p>Loading report...</p>}>
        <ReportDetails />
      </Suspense>
    </>
  );
}
