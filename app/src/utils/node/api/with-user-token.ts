import "src/utils/node/firebase";

import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";

import { withBearerToken } from "./with-bearer-token";

const db = getFirestore();
const auth = getAuth();

type WithUserTokenHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  meta: { token: string; user: any }
) => any;

export function withUserToken(handler: WithUserTokenHandler) {
  return withBearerToken(async (req, res, { token }) => {
    const decoded = await auth.verifyIdToken(token);
    if (!decoded.uid) {
      return res
        .status(401)
        .json({ message: "Invalid user id token provided" });
    }

    const userSnap = await db.collection("users").doc(decoded.uid).get();
    if (!userSnap.exists) {
      return res
        .status(401)
        .json({ message: "Invalid user id token provided" });
    }

    const user: any = { id: userSnap.id, ...userSnap.data() };
    return handler?.(req, res, { token, user });
  });
}
