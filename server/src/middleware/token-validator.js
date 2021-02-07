const admin = require("firebase-admin");
const bcrypt = require("bcryptjs");

export async function tokenValidator(req, res, next) {
  if (!req.token) {
    res.status(400).json({ message: "No valid token defined" });
    return;
  }

  console.log({ token: req.token });

  const snap = await admin
    .firestore()
    .collection("projects")
    .where("token", "==", req.token)
    .get();

  let items = [];
  snap.forEach((project) => {
    items.push({ id: project.id, ...project.data() });
  });

  if (!items.length) {
    res.status(400).json({ message: "Invalid token" });
    return;
  }

  req.projectId = items[0].id;

  next();
}
