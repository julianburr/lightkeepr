import { Suspense } from "react";
import firebase from "firebase/app";
import { useParams } from "react-router";
import styled from "styled-components";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { useCollection } from "../../hooks/@firebase";
import { List, ListItem } from "../../components/list";
import { Tag } from "../../components/tag";
import { formatDateSince } from "../../utils/date";
import { ScoreDiff } from "../../components/score";
import { Spacer } from "../../components/spacer";

dayjs.extend(relativeTime);

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  & > * {
    margin-left: 0.6rem;

    &:first-child {
      margin-left: 0;
    }
  }
`;

function BuildDetails() {
  const { projectId, buildId } = useParams<{
    projectId: string;
    buildId: string;
  }>();

  const reports = useCollection(
    firebase
      .firestore()
      .collection("reports")
      .where(
        "build",
        "==",
        firebase.firestore().collection("builds").doc(buildId)
      ),
    { key: `reports-${buildId}` }
  );

  return (
    <List
      items={reports}
      Item={({ data }) => {
        return (
          <ListItem
            key={data.id}
            to={`/p/${projectId}/b/${buildId}/r/${data.id}`}
            title={data.url}
            meta={`Created ${formatDateSince(data.createdAt)}`}
            preview={
              data.status ? (
                <PreviewContainer>
                  <Tag>{data.status}</Tag>
                  <Spacer width="1.8rem" />
                  <ScoreDiff
                    score={data.scorePerformance}
                    oldScore={data.prevScorePerformance}
                  />
                  <ScoreDiff
                    score={data.scoreAccessibility}
                    oldScore={data.prevScoreAccessibility}
                  />
                  <ScoreDiff
                    score={data.scoreBestPractices}
                    oldScore={data.prevScoreBestPractices}
                  />
                  <ScoreDiff
                    score={data.scoreSeo}
                    oldScore={data.prevScoreSeo}
                  />
                  <ScoreDiff
                    score={data.scorePwa}
                    oldScore={data.prevScorePwa}
                  />
                </PreviewContainer>
              ) : null
            }
          />
        );
      }}
    />
  );
}

export function BuildDetailsScreen() {
  return (
    <>
      <h1>Reports</h1>
      <Suspense fallback={<p>Loading build...</p>}>
        <BuildDetails />
      </Suspense>
    </>
  );
}
