import { startRun } from "@lightkeepr/node";

async function runStart(argv) {
  try {
    const run = await startRun({
      apiUrl: argv.apiUrl || process.env.LIGHTKEEPR_API_URL,
      token: argv.token || process.env.LIGHTKEEPR_TOKEN,
      branch: argv.branch,
      commitMessage: argv.commitMessage,
      repo: argv.repo,
    });
    if (!run?.id) {
      process.exit(1);
    }
    console.log(run.id);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

export default {
  command: "start",
  desc: "Starts new build",

  builder: (yargs) =>
    yargs
      .option("apiUrl", {
        description: "API url used to send the lighthouse report to",
        default: "https://lightkeepr.vercel.app/api",
      })
      .option("branch", {
        description: "Current branch",
      })
      .option("commitMessage", {
        description: "Commit message of the current commit",
      })
      .option("repo", {
        description: "Current github repo",
      })
      .option("token", {
        description: "Project API token",
      }),

  handler: (argv) => {
    runStart(argv).catch(console.error);
  },
};
