import "src/utils/node/firebase";

import { Storage } from "@google-cloud/storage";
import { getFirestore } from "firebase-admin/firestore";

import { env } from "src/env";
import { createHandler } from "src/utils/node/api";
import { withBearerToken } from "src/utils/node/api/with-bearer-token";
import { event } from "src/utils/node/ga";

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
  comments: {},
};

export default createHandler({
  post: withBearerToken(async (_, res, { token }) => {
    if (token !== env.bearerToken) {
      return res.status(401).json({ message: "Invalid bearer token provided" });
    }

    // TODO: consider creating backups as part of this

    // We collect all deletions in a promise array to be able to run them
    // in parallel in the end
    const promises: Promise<any>[] = [];

    const teamsSnap = await db.collection("teams").get();
    teamsSnap.forEach((team: any) => {
      cache.teams[team.id] = { id: team.id, ...team.data() };
    });

    /**
     * Soft delete archived teams if the deletion date has been reached
     */
    Object.values(cache.teams).forEach((team: any) => {
      if (team.status === "archived" && team.deleteAt < new Date()) {
        delete cache.teams[team.id];
      }
    });

    /**
     * Delete projects that don't have a valid team
     */
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

    /**
     * Delete all runs that don't have a valid project
     */
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

    /**
     * Delete all reports that don't have a valid run
     */
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

    /**
     * Clean up reports based on team plan and associated retention
     */
    const grouped = Object.values(cache.reports).reduce<{
      [teamId: string]: any[];
    }>((all: any, report: any) => {
      if (!all[report.team.id]) {
        all[report.team.id] = [report];
      } else {
        all[report.team.id].push(report);
      }
      return all;
    }, {});

    Object.keys(grouped).forEach((teamId) => {
      const team = cache.teams[teamId];

      // Sort grouped reports by date, so when we splice below we splice off the
      // oldest reports
      const reports = grouped[teamId].sort(
        (a: any, b: any) => b.createdAt?.seconds - a.createdAt?.seconds
      );

      // Determine team specific limit
      const limit =
        team.plan === "custom"
          ? team.reportLimit
          : team.plan === "premium"
          ? 5000
          : 300;

      if (limit && reports.length > limit) {
        // Delete all reports in excess of the limit
        reports.splice(limit).forEach((report) => {
          promises.push(db.collection("reports").doc(report.id).delete());
        });
      }
    });

    /**
     * Delete report files that don't have a valid db entry
     */
    const [files] = await bucket.getFiles();
    files.forEach((file) => {
      const reportId = file.name.replace(/\.brotli$/, "");
      if (!cache.reports[reportId]) {
        promises.push(bucket.file(file.name).delete());
      }
    });

    /**
     * Delete all subscription references that are not valid anymore
     */
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

    /**
     * Delete all comments that don't have a valid reference anymore
     */
    const commentsSnap = await db.collection("comments").get();
    commentsSnap.forEach((comment: any) => {
      cache.comments[comment.id] = { id: comment.id, ...comment.data() };
    });

    Object.values(cache.comments).forEach((comment: any) => {
      if (
        (comment.report?.id && !cache.reports?.[comment.report.id]) ||
        (comment.run?.id && !cache.runs?.[comment.run.id]) ||
        (comment.project?.id && !cache.projects?.[comment.project.id])
      ) {
        delete cache.comments[comment.id];
        promises.push(db.collection("comments").doc(comment.id).delete());
      }
    });

    /**
     * Await all promises
     */
    await Promise.all(promises);

    // DONE
    event({ action: "cleanup_records" });
    return res.status(204).send("");
  }),
});
