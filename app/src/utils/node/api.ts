import "src/utils/node/firebase";

import { getFirestore } from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";

const db = getFirestore();

type Handler = (req: NextApiRequest, res: NextApiResponse) => any;

type Endpoints = {
  get?: Handler;
  post?: Handler;
  put?: Handler;
  delete?: Handler;
};

export function createHandler(endpoints: Endpoints) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method?.toLowerCase() as keyof Endpoints;
    try {
      if (method && endpoints?.[method]) {
        await endpoints[method]?.(req, res);
      } else {
        res.status(404).json({ message: "Endpoint not found!" });
      }
    } catch (e: any) {
      res.status(500).json({ message: e.message, stack: e.strack });
    }
  };
}

type WithBearerTokenHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  meta: { token: string }
) => any;

export function withBearerToken(handler: WithBearerTokenHandler) {
  return (req: NextApiRequest, res: NextApiResponse) => {
    const [, token] = req.headers?.authorization?.match?.(/Bearer (.+)/) || [];
    if (!token) {
      return res.status(401).json({ message: "Invalid bearer token provided" });
    }
    return handler?.(req, res, { token });
  };
}

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
