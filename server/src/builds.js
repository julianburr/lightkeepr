const express = require("express");
const admin = require("firebase-admin");

const { tokenValidator } = require("./middleware/token-validator");

const router = express.Router();
router.use(tokenValidator);

router.post("/start", async (req, res) => {
  console.log({ body: req.body });
  const snap = await admin
    .firestore()
    .collection("builds")
    .where(
      "project",
      "==",
      admin.firestore().collection("projects").doc(req.projectId)
    )
    .where("branch", "==", req.body.branch)
    .orderBy("startedAt", "desc")
    .get();

  console.log({ snap });

  let prevBuildId;
  snap.forEach((build) => {
    if (!prevBuildId) {
      prevBuildId = build.id;
    }
  });

  console.log({ prevBuildId });

  const created = await admin
    .firestore()
    .collection("builds")
    .add({
      prevBuild: admin.firestore().collection("builds").doc(prevBuildId),
      startedAt: new Date(),
      project: admin.firestore().collection("projects").doc(req.projectId),
      branch: req.body.branch || null,
      commit: req.body.commit || null,
      repo: req.body.repo || null,
    });

  res.send({ id: created.id });
});

router.post("/:id/stop", async (req, res) => {
  const buildRef = admin.firestore().collection("builds").doc(req.params.id);
  const doc = await buildRef.get();

  if (!doc.exists) {
    res.status(404).send({ message: "Build not found" });
    return;
  }

  const build = doc.data();
  if (build.project.id !== req.projectId) {
    res.status(400).send({ message: "Invalid project ID" });
    return;
  }

  const snap = await admin
    .firestore()
    .collection("reports")
    .where("build", "==", buildRef)
    .get();

  let reports = [];
  snap.forEach((report) => {
    reports.push(report.data());
  });

  let status = "new";
  if (reports.find((report) => report.status === "regression")) {
    status = "regression";
  } else if (reports.find((report) => report.status === "improved")) {
    status = "improved";
  } else if (reports.find((report) => report.status === "unchanged")) {
    status = "unchanged";
  }

  console.log({ status });

  const update = await buildRef.update({
    finishedAt: new Date(),
    status,
    statusCode: req.body.statusCode || 0,
  });

  res.send({ id: update.id });
});

module.exports = router;
