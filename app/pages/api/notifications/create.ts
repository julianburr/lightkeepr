import "src/utils/node/firebase";

import { getFirestore, Timestamp } from "firebase-admin/firestore";

import { createHandler } from "src/utils/node/api";
import { generateToken } from "src/utils/token";

const db = getFirestore();

export default createHandler({
  post: async (req, res) => {
    if (!req?.body?.type) {
      return res.status(400).json({ message: "No type provided" });
    }

    if (!req?.body?.ref) {
      return res.status(400).json({ message: "No reference provided" });
    }

    const recordRef = db.doc(req.body.ref);
    const recordSnap = await recordRef.get();
    if (!recordSnap?.id) {
      return res.status(400).json({ message: "Invalid reference provided" });
    }

    const data: any = { id: recordSnap.id, ...recordSnap.data?.() };
    if (!data.team?.id) {
      return res
        .status(400)
        .json({ message: "Reference is missing team association" });
    }

    const teamId = data.team.id;
    const notification: any = {
      id: generateToken(12),
      createdAt: Timestamp.now(),
      type: req.body.type,
      seenAt: null,
      team: db.collection("teams").doc(teamId),
      record: recordRef,
      references: [],
    };

    switch (req.body.type) {
      case "report-failed": {
        const projectRef = db.collection("projects").doc(data.project.id);
        const projectSnap = await projectRef.get();

        notification.title = `Report failed`;
        notification.description =
          `The report "${data.name}" failed in the ` +
          `project "${projectSnap.data?.()?.name}"`;

        notification.href = `/app/${teamId}/reports/${data.id}`;
        notification.references.push(projectRef);

        break;
      }

      case "comment":
      case "comment-reply": {
        // TODO: add type and title of record related to the comment
        // + add extract + add deep link to the comment
        const userSnap = await db
          .collection("users")
          .doc(data.createdBy.id)
          .get();

        notification.title =
          req.body.type === "comment-reply" ? "New reply" : "New comment";
        notification.description =
          req.body.type === "comment-reply"
            ? userSnap.data?.()?.name + ` created a new reply`
            : userSnap.data?.()?.name + ` created a new comment`;

        if (req.body.type === "comment-reply") {
          notification.references.push(recordRef);
        }

        if (data.record?.path) {
          notification.references.push(db.doc(data.record.path));
        }

        break;
      }

      default:
        return res.status(400).json({ message: "Invalid type provided" });
    }

    // Find all users that have a subscription to any of the references
    const usersSnap = await db
      .collection("users")
      .where("subscriptions", "array-contains-any", notification.references)
      .get();

    const users: any[] = [];
    usersSnap.forEach((userSnap) => {
      users.push({ id: userSnap.id, ...userSnap.data() });
    });

    // Add notification to all users
    await Promise.all(
      users.map(async (user) => {
        if (req.body.userId && user.id === req.body.userId) {
          // Do nothing if this is the user who triggered the notification
          // to avoid redundant notifications
          return null;
        }
        await db
          .collection("users")
          .doc(user.id)
          .update({
            notifications: {
              ...(user.notifications || {}),
              [teamId]: [...(user.notifications?.[teamId] || []), notification],
            },
          });

        // TODO: send email if user subscribed to email notifications
      })
    );

    return res.status(200).send({ notification, userCount: users.length });
  },
});
