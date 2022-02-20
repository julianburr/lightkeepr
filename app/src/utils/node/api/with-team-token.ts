import "src/utils/node/firebase";

import { getFirestore } from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";

import { withUserToken } from "./with-user-token";

const db = getFirestore();

type WithTeamTokenHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  meta: { token: string; user: any; team: any }
) => any;

export function withTeamToken(handler: WithTeamTokenHandler) {
  return withUserToken(async (req, res, { token, user }) => {
    const teamId = req.headers["x-lightkeepr-team"] as string;
    if (!teamId) {
      return res.status(401).json({ message: "Invalid team header provided" });
    }

    const teamSnap = await db.collection("teams").doc(teamId).get();
    if (!teamSnap.exists) {
      return res.status(401).json({ message: "Invalid team header provided" });
    }

    const team: any = { id: teamSnap.id, ...teamSnap.data() };
    if (!team.users.includes(user.id)) {
      return res.status(401).json({ message: "Invalid team header provided" });
    }

    return handler?.(req, res, { token, user, team });
  });
}
