import "src/utils/node/firebase";

import { getFirestore, Timestamp } from "firebase-admin/firestore";

import { createHandler } from "src/utils/node/api";
import { withProjectToken } from "src/utils/node/api/with-project-token";
import { event } from "src/utils/node/ga";

const db = getFirestore();

export default createHandler({
  post: withProjectToken(async (req, res, { project }) => {
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
      status: { value: "running" },
    });
    const run = await ref.get();

    // Update project status
    await db
      .collection("projects")
      .doc(project.id)
      .update({
        lastRunAt: now,
        lastRun: db.collection("runs").doc(run.id),
        status: { value: "running" },
      });

    event({ uid: project.id, action: "run_start" });
    return res.status(200).json({ id: run.id, ...run.data() });
  }),
});
