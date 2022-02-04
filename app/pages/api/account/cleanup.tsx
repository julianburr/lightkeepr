import "src/utils/node/firebase";

import { Storage } from "@google-cloud/storage";
import { getFirestore } from "firebase-admin/firestore";
import credentials from "google-service-account.json";
import { NextApiRequest, NextApiResponse } from "next";

import { env } from "src/env";
import { createHandler } from "src/utils/node/api";

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

    await Promise.all(
      Object.values(cache.projects).map((project: any) => {
        const teamId = project.team?.id;
        if (!teamId || !cache.teams[teamId]?.id) {
          // Team does not exist
          delete cache.projects[project.id];
          return db.collection("projects").doc(project.id).delete();
        }
      })
    );

    // 2. Delete all runs that don't have a valid project
    const runsSnap = await db.collection("runs").get();
    runsSnap.forEach((run: any) => {
      cache.runs[run.id] = { id: run.id, ...run.data() };
    });

    await Promise.all(
      Object.values(cache.runs).map((run: any) => {
        const projectId = run.project?.id;
        if (!projectId || !cache.projects[projectId]?.id) {
          // Project does not exist
          delete cache.runs[run.id];
          return db.collection("runs").doc(run.id).delete();
        }
      })
    );

    // 3. Delete all reports that don't have a valid run
    const reportsSnap = await db.collection("reports").get();
    reportsSnap.forEach((report: any) => {
      cache.reports[report.id] = { id: report.id, ...report.data() };
    });

    await Promise.all(
      Object.values(cache.reports).map((report: any) => {
        const runId = report.run?.id;
        if (!runId || !cache.runs[runId]?.id) {
          // Run does not exist
          delete cache.reports[report.id];
          return db.collection("reports").doc(report.id).delete();
        }
      })
    );

    // Delete report files that don't have a valid db entry
    const [files] = await bucket.getFiles();
    await Promise.all(
      files.map((file) => {
        const reportId = file.name.replace(/\.brotli$/, "");
        if (!cache.reports[reportId]) {
          return bucket.file(file.name).delete();
        }
      })
    );

    // 4. Delete all subscription references that are not  valid anymore
    const usersSnap = await db.collection("users").get();
    usersSnap.forEach((user: any) => {
      cache.users[user.id] = { id: user.id, ...user.data() };
    });

    await Promise.all(
      Object.values(cache.users).map((user: any) => {
        let newSubscriptions = user.subscriptions;
        for (const subscription of user.subscriptions || []) {
          const [collection, id] = subscription._path.segments;
          console.log({ path: subscription._path, collection, id });
          if (cache[collection] && !cache[collection][id]) {
            newSubscriptions = newSubscriptions.filter(
              (s: any) => s !== subscription
            );
          }
        }

        if (newSubscriptions !== user?.subscriptions) {
          return db
            .collection("users")
            .doc(user.id)
            .update({ subscriptions: newSubscriptions });
        }
      })
    );

    // DONE
    return res.status(204).send("");
  },
});
