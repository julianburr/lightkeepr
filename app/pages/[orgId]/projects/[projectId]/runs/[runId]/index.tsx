import {
  getFirestore,
  doc,
  query,
  collection,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";

import { useCollection, useDocument } from "src/@packages/firebase";
import { List, ListItem } from "src/components/list";

const db = getFirestore();

export default function RunDetailsScreen() {
  const router = useRouter();
  const { orgId, projectId, runId } = router.query;

  const runRef = doc(db, "runs", runId);
  const run = useDocument(runRef);

  const reports = useCollection(
    query(collection(db, "reports"), where("run", "==", runRef)),
    { key: `reports--${orgId}--${projectId}--${runId}` }
  );

  return (
    <>
      <h1>Run</h1>

      <h2>Details</h2>
      <p>ID: {run.id}</p>
      <p>Time: {run.createdAt.toString()}</p>

      <h2>Reports</h2>
      <List
        items={reports}
        Item={({ item }) => (
          <ListItem
            href={`/${orgId}/projects/${projectId}/runs/${runId}/reports/${item.id}`}
            title={item.url}
          />
        )}
      />
    </>
  );
}
