import * as lightkeepr from "@lightkeepr/node";

const startRun = lightkeepr.startRun;

async function runStart(argv) {
  try {
    const run = await startRun({
      apiUrl: argv.apiUrl,
      token: argv.token,
      branch: argv.branch,
      commit: argv.commit,
      commitMessage: argv.commitMessage,
      repo: argv.repo,
    });
    if (!run?.id) {
      process.exit(1);
    }
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
      })
      .option("branch", {
        description: "Current branch",
      })
      .option("commit", {
        description: "Commit hash of the current commit",
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
