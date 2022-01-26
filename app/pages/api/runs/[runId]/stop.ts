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

    let project;
    projectsSnap.forEach((p) => {
      project = { id: p.id, ...p.data() };
    });

    await db
      .collection("runs")
      .doc(req.query.runId as string)
      .update({
        status: req.body?.statusCode === 0 ? "success" : "failed",
        error: req.body?.error || null,
        finishedAt: Timestamp.fromDate(new Date()),
      });

    const run = await db
      .collection("runs")
      .doc(req.query.runId as string)
      .get();

    return res.status(200).json({ id: run.id, ...run.data() });
  },
});
