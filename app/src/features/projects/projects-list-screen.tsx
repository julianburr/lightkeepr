import { Suspense } from "react";
import app from "firebase/app";

import { Button } from "../../components/button";
import { List, ListItem } from "../../components/list";
import { TitleBar } from "../../components/title-bar";
import { useAuth, useCollection } from "../../hooks/@firebase";

function ProjectsList() {
  const authUser = useAuth();
  const projects = useCollection(
    app
      .firestore()
      .collection("projects")
      .where("collaborators", "array-contains", authUser.uid),
    {
      key: "projects",
    }
  );
  return (
    <List
      items={projects}
      Item={({ data }) => (
        <ListItem
          key={data.id}
          tag={data.id}
          to={`/p/${data.id}`}
          title={data.name}
          meta={`Last build 3 days ago`}
        />
      )}
    />
  );
}

export function ProjectsListScreen() {
  return (
    <>
      <TitleBar>
        <h1>Projects</h1>
        <Button primary to="/p/new">
          Create project
        </Button>
      </TitleBar>
      <Suspense fallback={<p>Loading projects...</p>}>
        <ProjectsList />
      </Suspense>
    </>
  );
}
