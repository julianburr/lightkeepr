import "src/utils/node/firebase";

import { getFirestore, Timestamp } from "firebase-admin/firestore";

import { createHandler } from "src/utils/node/api";
import { withProjectToken } from "src/utils/node/api/with-project-token";

const db = getFirestore();

export default createHandler({
  post: withProjectToken(async (req, res, { project }) => {
    const [, token] = req.headers?.authorization?.match?.(/Bearer (.+)/) || [];

    if (!req.query.runId) {
      return res.status(400).json({ message: "No run ID provided" });
    }

    // Get status based on report statuses
    const reportsSnap = await db
      .collection("reports")
      .where("run", "==", db.collection("runs").doc(req.query.runId as string))
      .get();

    const reports: any[] = [];
    reportsSnap.forEach((r: any) => {
      reports.push({ id: r.id, ...r.data() });
    });

    const reportStatus = reports.map((report) => report.status);
    const status = {
      value: reportStatus.find((status) => status?.value === "failed")
        ? "failed"
        : "passed",
    };

    await db
      .collection("runs")
      .doc(req.query.runId as string)
      .update({
        status,
        reportStatus,
        error: req.body?.error || null,
        finishedAt: Timestamp.fromDate(new Date()),
      });

    const runSnap: any = await db
      .collection("runs")
      .doc(req.query.runId as string)
      .get();
    const run = { id: runSnap.id, ...runSnap.data() };

    // Update project status
    await db
      .collection("projects")
      .doc(project.id)
      .update({
        status: project.gitMain === run.branch ? status : project.status,
      });

    return res.status(200).json(run);
  }),
});
