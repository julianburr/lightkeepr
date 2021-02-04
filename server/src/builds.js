const express = require("express");
const admin = require("firebase-admin");

const { tokenValidator } = require("./middleware/token-validator");

const router = express.Router();
router.use(tokenValidator);

router.post("/start", async (req, res) => {
  const created = await admin
    .firestore()
    .collection("builds")
    .add({
      startedAt: new Date(),
      project: admin.firestore().collection("projects").doc(req.projectId),
      branch: req.body.branch || null,
      commit: req.body.commit || null,
      repo: req.body.repo || null,
    });

  res.send({ id: created.id });
});

router.post("/:id/end", async (req, res) => {
  const doc = await admin
    .firestore()
    .collection("builds")
    .doc(req.params.id)
    .get();
  console.log({ doc });

  if (!doc.exists) {
    res.status(404).send({ message: "Build not found" });
    return;
  }

  if (doc.data().projectId !== req.projectId) {
    res.status(400).send({ message: "Invalid project ID" });
    return;
  }

  const update = await admin
    .firestore()
    .collection("builds")
    .doc(req.params.id)
    .update({
      finishedAt: new Date(),
      statusCode: req.body.statusCode || 0,
    });

  res.send({ id: update.id });
});

module.exports = router;
