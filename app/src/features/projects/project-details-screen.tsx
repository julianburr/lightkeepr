import { Suspense, useMemo, useState } from "react";
import firebase from "firebase/app";
import { useParams } from "react-router";

import { useCollection, useDocument } from "../../hooks/@firebase";
import { formatDateSince } from "../../utils/date";
import { TitleBar } from "../../components/title-bar";
import { ButtonBar } from "../../components/button-bar";
import { Button } from "../../components/button";
import { List, ListItem } from "../../components/list";
import { Tag } from "../../components/tag";

function ProjectDetails() {
  const [branch, setBranch] = useState("");

  const { projectId } = useParams<{ projectId: string }>();

  const projectRef = firebase.firestore().collection("projects").doc(projectId);
  const project = useDocument(projectRef);
  const builds = useCollection(
    firebase
      .firestore()
      .collection("builds")
      .where("project", "==", projectRef)
      .orderBy("startedAt", "desc"),
    { key: `builds-${project.id}` }
  );

  const branches = useMemo(
    () =>
      builds.reduce((all, build) => {
        if (build.branch && !all.includes(build.branch)) {
          all.push(build.branch);
        }
        return all;
      }, []),
    [builds]
  );

  const filteredItems = useMemo(
    () => builds.filter((build) => !branch || build.branch === branch),
    [builds, branch]
  );

  return (
    <>
      <p>
        Filter by branch:{" "}
        <select onChange={(e) => setBranch(e.target.value)} value={branch}>
          <option value={""}>no filter</option>
          {branches.map((b) => (
            <option value={b}>{b}</option>
          ))}
        </select>
      </p>

      <List
        items={filteredItems}
        Item={({ data }) => {
          const meta = data.finishedAt
            ? `Finished ${formatDateSince(data.finishedAt)}`
            : data.startedAt
            ? `Started ${formatDateSince(data.startedAt)}`
            : null;

          return (
            <ListItem
              key={data.id}
              to={`/p/${projectId}/b/${data.id}`}
              title={`#${data.id}`}
              tag={data.branch}
              meta={meta}
              preview={data.status ? <Tag>{data.status}</Tag> : null}
            />
          );
        }}
      />
    </>
  );
}

export function ProjectDetailsScreen() {
  const { projectId } = useParams<{ projectId: string }>();
  return (
    <>
      <TitleBar>
        <h1>Builds</h1>
        <ButtonBar margin={false}>
          <Button to={`/p/${projectId}/settings/add-collaborators`}>
            Add collaborators
          </Button>
          <Button to={`/p/${projectId}/settings`}>Project settings</Button>
        </ButtonBar>
      </TitleBar>
      <Suspense fallback={<p>Loading project...</p>}>
        <ProjectDetails />
      </Suspense>
    </>
  );
}
