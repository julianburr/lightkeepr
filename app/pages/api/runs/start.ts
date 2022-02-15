import "src/utils/node/firebase";

import { getFirestore, Timestamp } from "firebase-admin/firestore";

import { createHandler } from "src/utils/node/api";

const db = getFirestore();

export default createHandler({
  post: async (req, res) => {
    const [, token] = req.headers?.authorization?.match?.(/Bearer (.+)/) || [];

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

    const projectRef = db.collection("projects").doc(project.id);
    const teamRef = db.collection("teams").doc(project.team.id);

    const now = Timestamp.fromDate(new Date());

    const ref = await db.collection("runs").add({
      project: projectRef,
      team: teamRef,
      startedAt: now,
      finishedAt: null,
      lastReportAt: null,
      branch: req.body.branch || null,
      commit: req.body.commit || null,
      commitMessage: req.body.commitMessage || null,
      repo: req.body.repo || null,
      status: "running",
    });
    const run = await ref.get();

    // Update project status
    await db
      .collection("projects")
      .doc(project.id)
      .update({
        lastRunAt: now,
        lastRun: db.collection("runs").doc(run.id),
        status: "running",
      });

    return res.status(200).json({ id: run.id, ...run.data() });
  },
});
