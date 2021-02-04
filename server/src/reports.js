const express = require("express");
const admin = require("firebase-admin");
const brotli = require("brotli");
const multer = require("multer");

const { tokenValidator } = require("./middleware/token-validator");

const router = express.Router();
router.use(tokenValidator);

const upload = multer();

router.post("/create", upload.single("file"), async (req, res) => {
  console.log({ body: req.body });

  if (!req.body.buildId) {
    res.status(400).send({ message: "No build defined" });
    return;
  }

  if (!req.body.url) {
    res.status(400).send({ message: "No URL defined" });
    return;
  }

  if (!req.file || !req.file.buffer) {
    res.status(400).send({ message: "No report file defined" });
    return;
  }

  const doc = await admin
    .firestore()
    .collection("builds")
    .doc(req.body.buildId)
    .get();

  if (!doc.exists) {
    res.status(400).send({ message: "Build not found" });
    return;
  }

  console.log({ data: doc.data() });
  if (doc.data().project.id !== req.projectId) {
    res.status(400).send({ message: "Invalid token" });
    return;
  }

  const fileBuffer = req.file.buffer;

  let report;
  try {
    const decompressed = brotli.decompress(fileBuffer);
    const decompressedBuffer = Buffer.from(decompressed);
    report = JSON.parse(decompressedBuffer.toString());
  } catch (e) {
    console.error(e);
  }

  if (!report) {
    res.status(400).send({ message: "Invalid report file" });
  }

  const created = await admin
    .firestore()
    .collection("reports")
    .add({
      createdAt: new Date(),
      build: admin.firestore().collection("builds").doc(req.body.buildId),
      url: req.body.url,
      file: fileBuffer.toString(),
      scorePerformance: report.categories.performance.score || null,
      scoreAccessibility: report.categories.accessibility.score || null,
      scoreBestPractices: report.categories["best-practices"].score || null,
      scoreSeo: report.categories.seo.score || null,
      scorePwa: report.categories.pwa.score || null,
    });

  res.send({ id: created.id });
});

module.exports = router;
