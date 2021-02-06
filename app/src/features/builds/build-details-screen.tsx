import { Suspense } from "react";
import firebase from "firebase/app";
import { useParams } from "react-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { useCollection } from "../../hooks/@firebase";
import { List, ListItem } from "../../components/list";

dayjs.extend(relativeTime);

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
            title={`#${data.id}`}
          />
        );
      }}
    />
  );
}

export function BuildDetailsScreen() {
  const { buildId } = useParams<{ buildId: string }>();
  return (
    <>
      <h1>#{buildId}</h1>
      <Suspense fallback={<p>Loading build...</p>}>
        <BuildDetails />
      </Suspense>
    </>
  );
}
