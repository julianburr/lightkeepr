import "src/utils/node/firebase";

import { createHash } from "crypto";

import { getAuth } from "firebase-admin/auth";

import { createHandler } from "src/utils/node/api";
import { withUserToken } from "src/utils/node/api/with-user-token";

const auth = getAuth();

export default createHandler({
  post: withUserToken(async (req, res, { user }) => {
    if (!req.body.email) {
      return res.status(400).json({ message: "Email not specified" });
    }

    if (!req.body.vid) {
      return res.status(400).json({ message: "Validation hash not specified" });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Create confirmation hash to validate
    const content = `${process.env.SALT}:${user.metadata?.creationTime}:${user.email}:${user.uid}`;
    const hash = createHash("sha1").update(content).digest("hex");

    if (hash !== req.body.vid) {
      return res.status(400).json({ message: "Invalid validation hash" });
    }

    // Update user to set the verified email field
    const response = await auth.updateUser(user.uid, { emailVerified: true });
    res.status(200).json(response);
  }),
});
