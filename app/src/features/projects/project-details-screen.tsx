import { Suspense, useMemo, useState } from "react";
import firebase from "firebase/app";
import { useParams } from "react-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { useCollection, useDocument } from "../../hooks/@firebase";
import { TitleBar } from "../../components/title-bar";
import { ButtonBar } from "../../components/button-bar";
import { Button } from "../../components/button";
import { List, ListItem } from "../../components/list";

dayjs.extend(relativeTime);

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
      <TitleBar>
        <h1>{project.name}</h1>
        <ButtonBar margin={false}>
          <Button to={`/p/${projectId}/settings#collaborators`}>
            Add collaborators
          </Button>
          <Button to={`/p/${projectId}/settings`}>Project settings</Button>
        </ButtonBar>
      </TitleBar>

      <p>
        Filter by branch:{" "}
        <select onChange={(e) => setBranch(e.target.value)}>
          <option value={""}>no filter</option>
          {branches.map((b) => (
            <option value={b} selected={branch === b}>
              {b}
            </option>
          ))}
        </select>
      </p>

      <List
        items={filteredItems}
        Item={({ data }) => {
          const startedAt = dayjs(data.startedAt?.seconds * 1000);
          const finishedAt = dayjs(data.finishedAt?.seconds * 1000);

          const inProgress = !data.finishedAt;

          return (
            <ListItem
              key={data.id}
              to={`/p/${projectId}/b/${data.id}`}
              title={`#${data.id}`}
              tag={data.branch}
              meta={
                data.finishedAt
                  ? `Finished ${dayjs().to(finishedAt)}`
                  : data.startedAt
                  ? `Started ${dayjs().to(startedAt)}`
                  : null
              }
              inProgress={inProgress}
            />
          );
        }}
      />
    </>
  );
}

export function ProjectDetailsScreen() {
  return (
    <Suspense fallback={<p>Loading project...</p>}>
      <ProjectDetails />
    </Suspense>
  );
}
