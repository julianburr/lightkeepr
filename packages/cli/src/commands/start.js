const { startBuild } = require("@lightkeepr/node");

const { getEnv } = require("../utils/env");

async function runStart(argv) {
  const env = getEnv(argv);
  return startBuild({
    apiUrl: env.LIGHTKEEPR_API_URL,
    token: env.LIGHTKEEPR_TOKEN,
    branch: argv.branch,
    commit: argv.commit,
  });
}

module.exports = {
  command: "start",
  desc: "Starts new build",

  builder: (yargs) =>
    yargs
      .option("apiUrl", {
        description: "API url used to send the lighthouse report to",
        default: "https://lightkeepr-server.vercel.app",
      })
      .option("branch", {
        description: "Current branch",
      })
      .option("commit", {
        description: "Current commit",
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
