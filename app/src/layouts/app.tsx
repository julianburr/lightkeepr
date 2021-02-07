import { Suspense } from "react";
import styled from "styled-components";
import { Switch, Route } from "react-router-dom";

import { Header } from "../components/header";

import { ProjectDetailsScreen } from "../features/projects/project-details-screen";
import { ProjectSettingsScreen } from "../features/projects/project-settings-screen";
import { BuildDetailsScreen } from "../features/builds/build-details-screen";
import { ReportDetailsScreen } from "../features/reports/report-details-screen";
import { ProjectsListScreen } from "../features/projects/projects-list-screen";
import { CreateProjectScreen } from "../features/projects/create-project-screen";
import { ProjectAddCollaboratorsScreen } from "../features/projects/project-add-collaborators-screen";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Content = styled.div`
  width: 100%;
  max-width: 90rem;
  display: flex;
  flex-direction: column;
  padding: 2.4rem;
`;

export function AppLayout() {
  return (
    <Container>
      <Header />
      <Main>
        <Content>
          <Suspense fallback={<p>Loading...</p>}>
            <Switch>
              <Route exact path="/">
                <ProjectsListScreen />
              </Route>
              <Route path="/p/:projectId/b/:buildId/r/:reportId">
                <ReportDetailsScreen />
              </Route>
              <Route path="/p/:projectId/b/:buildId">
                <BuildDetailsScreen />
              </Route>
              <Route path="/p/:projectId/settings/add-collaborators">
                <ProjectAddCollaboratorsScreen />
              </Route>
              <Route path="/p/:projectId/settings">
                <ProjectSettingsScreen />
              </Route>
              <Route path="/p/new">
                <CreateProjectScreen />
              </Route>
              <Route path="/p/:projectId">
                <ProjectDetailsScreen />
              </Route>
              <Route path="/profile">
                <ProjectDetailsScreen />
              </Route>
            </Switch>
          </Suspense>
        </Content>
      </Main>
    </Container>
  );
}
