import {
  getFirestore,
  doc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import Link from "next/link";
import styled from "styled-components";

import { useCollection } from "src/@packages/firebase";
import { List, ListItem } from "src/components/list";

const db = getFirestore();

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 1.2rem;

  & h1 {
    margin-top: 0;
    margin-bottom: 0;
  }

  & > * {
    margin-right: 0.8rem;

    &:last-child {
      margin-right: 0;
    }
  }
`;

export default function ProjectsScreen() {
  const router = useRouter();
  const { orgId } = router.query;

  const orgRef = doc(db, "organisations", orgId);
  const projects = useCollection(
    query(collection(db, "projects"), where("organisation", "==", orgRef)),
    { key: `projects--${orgId}` }
  );

  return (
    <>
      <Header>
        <h1>Projects</h1>
        <Link href={`/${orgId}/projects/create`}>Create new project</Link>
      </Header>

      <List
        items={projects}
        Item={({ item }) => (
          <ListItem
            href={`/${orgId}/projects/${item.id}`}
            title={item.name}
            meta={
              <>
                Last run {item.lastRun} - 0 currently pending or failing
                branches
              </>
            }
          />
        )}
      />
    </>
  );
}
