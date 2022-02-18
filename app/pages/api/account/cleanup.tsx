import "src/utils/node/firebase";

import { Storage } from "@google-cloud/storage";
import { getFirestore } from "firebase-admin/firestore";
import { NextApiRequest, NextApiResponse } from "next";

import { env } from "src/env";
import { createHandler } from "src/utils/node/api";

import credentials from "src/google-service-account.json";

const db = getFirestore();

const storage = new Storage({
  projectId: credentials.project_id,
  credentials,
});

const bucket = storage.bucket(env.firebase.storageBucket!);

const cache: any = {
  teams: {},
  projects: {},
  runs: {},
  reports: {},
  users: {},
};

export default createHandler({
  post: async (_: NextApiRequest, res: NextApiResponse) => {
    // We collect all deletions in a promise array to be able to run them
    // in parallel in the end
    const promises: Promise<any>[] = [];

    // TODO: consider creating backups as part of this

    const teamsSnap = await db.collection("teams").get();
    teamsSnap.forEach((team: any) => {
      cache.teams[team.id] = { id: team.id, ...team.data() };
    });

    // 1. Delete projects that don't have a valid team
    const projectsSnap = await db.collection("projects").get();
    projectsSnap.forEach((project: any) => {
      cache.projects[project.id] = { id: project.id, ...project.data() };
    });

    Object.values(cache.projects).forEach((project: any) => {
      const teamId = project.team?.id;
      if (!teamId || !cache.teams[teamId]?.id) {
        // Team does not exist
        delete cache.projects[project.id];
        promises.push(db.collection("projects").doc(project.id).delete());
      }
    });

    // 2. Delete all runs that don't have a valid project
    const runsSnap = await db.collection("runs").get();
    runsSnap.forEach((run: any) => {
      cache.runs[run.id] = { id: run.id, ...run.data() };
    });

    Object.values(cache.runs).forEach((run: any) => {
      const projectId = run.project?.id;
      if (!projectId || !cache.projects[projectId]?.id) {
        // Project does not exist
        delete cache.runs[run.id];
        promises.push(db.collection("runs").doc(run.id).delete());
      }
    });

    // 3. Delete all reports that don't have a valid run
    const reportsSnap = await db.collection("reports").get();
    reportsSnap.forEach((report: any) => {
      cache.reports[report.id] = { id: report.id, ...report.data() };
    });

    Object.values(cache.reports).forEach((report: any) => {
      const runId = report.run?.id;
      if (!runId || !cache.runs[runId]?.id) {
        // Run does not exist
        delete cache.reports[report.id];
        promises.push(db.collection("reports").doc(report.id).delete());
      }
    });

    // Delete report files that don't have a valid db entry
    const [files] = await bucket.getFiles();
    files.forEach((file) => {
      const reportId = file.name.replace(/\.brotli$/, "");
      if (!cache.reports[reportId]) {
        promises.push(bucket.file(file.name).delete());
      }
    });

    // 4. Delete all subscription references that are not valid anymore
    const usersSnap = await db.collection("users").get();
    usersSnap.forEach((user: any) => {
      cache.users[user.id] = { id: user.id, ...user.data() };
    });

    Object.values(cache.users).forEach((user: any) => {
      let newSubscriptions = user.subscriptions;
      for (const subscription of user.subscriptions || []) {
        const [collection, id] = subscription._path.segments;
        if (cache[collection] && !cache[collection][id]) {
          newSubscriptions = newSubscriptions.filter(
            (s: any) => s !== subscription
          );
        }
      }

      if (newSubscriptions !== user?.subscriptions) {
        promises.push(
          db
            .collection("users")
            .doc(user.id)
            .update({ subscriptions: newSubscriptions })
        );
      }
    });

    // 5. Delete all comments that don't have a valid reference anymore
    const commentsSnap = await db.collection("comments").get();
    commentsSnap.forEach((comment: any) => {
      cache.comments[comment.id] = { id: comment.id, ...comment.data() };
    });

    Object.values(cache.comments).forEach((comment: any) => {
      if (
        (comment.report?.id && !cache.reports?.[comment.report.id]) ||
        (comment.run?.id && !cache.runs?.[comment.run.id]) ||
        (comment.project?.id && !cache.project?.[comment.project.id])
      ) {
        delete cache.comments[comment.id];
        promises.push(db.collection("comments").doc(comment.id).delete());
      }
    });

    // -- Await all promises
    await Promise.all(promises);

    // DONE
    return res.status(204).send("");
  },
});
