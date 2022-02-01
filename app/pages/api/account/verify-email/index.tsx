import "src/utils/node/firebase";

import { createHash } from "crypto";

import { getAuth } from "firebase-admin/auth";

import { createHandler } from "src/utils/node/api";

const auth = getAuth();

export default createHandler({
  post: async (req, res) => {
    // Validate request
    if (!req.body.userUid) {
      return res.status(400).json({ message: "User not specified" });
    }

    if (!req.body.email) {
      return res.status(400).json({ message: "Email not specified" });
    }

    if (!req.body.vid) {
      return res.status(400).json({ message: "Validation hash not specified" });
    }

    // Fetch user from firebase and verify
    const user = await auth.getUser(req.body.userUid);
    if (user.email !== req.body.email) {
      return res.status(400).json({ message: "Invalid email" });
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
  },
});
