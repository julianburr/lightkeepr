import {
  getFirestore,
  doc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import Link from "next/link";

import { useCollection, useDocument } from "src/@packages/firebase";
import { List, ListItem } from "src/components/list";

const db = getFirestore();

export default function ProjectDetailsScreen() {
  const router = useRouter();
  const { orgId, projectId, runId } = router.query;

  const projectRef = doc(db, "projects", projectId);
  const project = useDocument(projectRef);
  const runs = useCollection(
    query(collection(db, "runs"), where("project", "==", projectRef)),
    { key: `runs--${orgId}--${projectId}` }
  );

  return (
    <>
      <h1>{project.name}</h1>

      <Link href={`/${orgId}/projects/${projectId}/settings`}>
        <a>Settings</a>
      </Link>
      <Link href={`/${orgId}/projects/${projectId}/integrations`}>
        <a>Integrations</a>
      </Link>

      <h2>Overview</h2>
      <p>...</p>

      <h2>Runs</h2>
      <List
        items={runs}
        Item={({ item }) => (
          <ListItem
            href={`/${orgId}/projects/${projectId}/runs/${item.id}`}
            title={item.id}
            meta={
              <>
                {item.branch} - {item.summary?.failed} failed /{" "}
                {item.summary?.pending} pending
              </>
            }
          />
        )}
      />
    </>
  );
}
