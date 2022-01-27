import "src/utils/node/firebase";

import { getFirestore, Timestamp } from "firebase-admin/firestore";

import { createHandler } from "src/utils/node/api";

const db = getFirestore();

export default createHandler({
  post: async (req, res) => {
    const [, token] = req.headers?.authorization?.match?.(/Bearer (.+)/) || [];

    if (!req.query.runId) {
      return res.status(400).json({ message: "No run ID provided" });
    }

    if (!token) {
      return res.status(401).json({ message: "No bearer token provided" });
    }

    const projectsSnap = await db
      .collection("projects")
      .where("apiToken", "==", token)
      .limit(1)
      .get();

    if (projectsSnap.empty) {
      return res.status(401).json({ message: "Invalid bearer token provided" });
    }

    let project: any;
    projectsSnap.forEach((p) => {
      project = { id: p.id, ...p.data() };
    });

    // TODO!
    const status = req.body?.statusCode === 0 ? "success" : "failed";
    const now = Timestamp.fromDate(new Date());

    await db
      .collection("runs")
      .doc(req.query.runId as string)
      .update({
        status,
        error: req.body?.error || null,
        finishedAt: now,
      });

    const run: any = await db
      .collection("runs")
      .doc(req.query.runId as string)
      .get();

    // Update project status
    await db
      .collection("projects")
      .doc(project.id)
      .update({
        lastRunAt: now,
        status: project.mainBranch === run.branch ? status : project.status,
      });

    return res.status(200).json({ id: run.id, ...run.data() });
  },
});
