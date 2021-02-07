const express = require("express");
const admin = require("firebase-admin");
const multer = require("multer");
const pako = require("pako");

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

  const build = doc.data();
  if (build.project.id !== req.projectId) {
    res.status(400).send({ message: "Invalid token" });
    return;
  }

  const fileBuffer = req.file.buffer;

  let report;
  try {
    report = JSON.parse(
      pako.inflate(Buffer.from(fileBuffer.toString(), "base64"), {
        to: "string",
      })
    );
  } catch (e) {
    console.error(e);
  }

  if (!report) {
    res.status(400).send({ message: "Invalid report file" });
  }

  const scores = {
    scorePerformance: report.categories.performance.score || null,
    scoreAccessibility: report.categories.accessibility.score || null,
    scoreBestPractices: report.categories["best-practices"].score || null,
    scoreSeo: report.categories.seo.score || null,
    scorePwa: report.categories.pwa.score || null,
  };

  const { status, prevReport } = await getStatus({
    scores,
    url: req.body.url,
    prevBuild: build.prevBuild,
  });

  const prevScores = {
    prevScorePerformance: prevReport?.scorePerformance || null,
    prevScoreAccessibility: prevReport?.scoreAccessibility || null,
    prevScoreBestPractices: prevReport?.scoreBestPractices || null,
    prevScoreSeo: prevReport?.scoreSeo || null,
    prevScorePwa: prevReport?.scorePwa || null,
  };

  const created = await admin
    .firestore()
    .collection("reports")
    .add({
      createdAt: new Date(),
      build: admin.firestore().collection("builds").doc(req.body.buildId),
      url: req.body.url,
      file: fileBuffer.toString(),
      status,
      prevReport: prevReport
        ? admin.firestore().collection("reports").doc(prevReport.id)
        : null,
      approved: false,
      approvedBy: null,
      ...scores,
      ...prevScores,
    });

  res.send({ id: created.id });
});

async function getStatus({ scores, url, prevBuild }) {
  if (!prevBuild) {
    return { status: "new", prevReport: null };
  }

  const snap = await admin
    .firestore()
    .collection("reports")
    .where("build", "==", prevBuild)
    .where("url", "==", url)
    .limit(1)
    .get();

  let prevReport;
  snap.forEach((report) => {
    if (!prevReport) {
      prevReport = { id: report.id, ...report.data() };
    }
  });

  if (!prevReport) {
    return { status: "new", prevReport };
  }

  let status = "unchanged";
  for (let scoreKey in scores) {
    console.log({
      scoreKey,
      new: scores[scoreKey],
      old: prevReport[scoreKey],
    });
    if (scores[scoreKey] && !prevReport[scoreKey]) {
      return { status: "regression", prevReport };
    } else if (
      !scores[scoreKey] &&
      prevReport[scoreKey] &&
      status === "unchanged"
    ) {
      status = "improvement";
    } else if (scores[scoreKey] < prevReport[scoreKey]) {
      return { status: "regression", prevReport };
    } else if (
      scores[scoreKey] > prevReport[scoreKey] &&
      status === "unchanged"
    ) {
      status = "improved";
    }
  }

  return { status, prevReport };
}

module.exports = router;
