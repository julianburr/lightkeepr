const admin = require("firebase-admin");
const bcrypt = require("bcryptjs");

export async function tokenValidator(req, res, next) {
  if (!req.token) {
    res.status(400).json({ message: "No valid token defined" });
    return;
  }

  const snapshot = await admin.firestore().collection("projects").get();

  let projects = [];
  snapshot.forEach((token) => {
    projects.push({ id: token.id, ...token.data() });
  });

  const project = projects.find((project) =>
    bcrypt.compareSync(req.token, project.token)
  );

  console.log({ project, projects, token: req.token });
  if (!project) {
    res.status(400).json({ message: "Invalid token" });
    return;
  }

  req.projectId = project.id;

  next();
}
