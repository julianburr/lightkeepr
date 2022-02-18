import "src/utils/node/firebase";

import { getFirestore } from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";

import { withBearerToken } from "./with-bearer-token";

const db = getFirestore();

type WithProjectTokenHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  meta: { token: string; team: any; project: any }
) => any;

export function withProjectToken(handler: WithProjectTokenHandler) {
  return withBearerToken(async (req, res, { token }) => {
    // Find project
    const projectsSnap = await db
      .collection("projects")
      .where("apiToken", "==", token)
      .limit(1)
      .get();

    if (projectsSnap.empty) {
      return res.status(401).json({ message: "Invalid bearer token provided" });
    }

    let project: any;
    projectsSnap.forEach((snap) => {
      project = { id: snap.id, ...snap.data() };
    });

    const teamSnap = await db.collection("teams").doc(project.team.id).get();
    if (!teamSnap.exists) {
      return res.status(401).json({ message: "Invalid bearer token provided" });
    }
    const team = { id: teamSnap.id, ...teamSnap.data() };

    return handler?.(req, res, { token, team, project });
  });
}
