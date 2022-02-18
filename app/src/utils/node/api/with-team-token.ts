import "src/utils/node/firebase";

import { getFirestore } from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";

import { withBearerToken } from "./with-bearer-token";

const db = getFirestore();

type WithTeamTokenHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  meta: { token: string; team: any }
) => any;

export function withTeamToken(handler: WithTeamTokenHandler) {
  return withBearerToken(async (req, res, { token }) => {
    const teamSnap = await db.collection("teams").doc(token).get();

    if (!teamSnap.exists) {
      return res.status(401).json({ message: "Invalid bearer token provided" });
    }

    const team: any = { id: teamSnap.id, ...teamSnap.data() };

    return handler?.(req, res, { token, team });
  });
}
