import { stopBuild } from "@lightkeepr/node";

function runStop(argv) {
  return stopBuild({
    apiUrl: argv.apiUrl || process.env.LIGHTKEEPR_API_URL,
    token: argv.token || process.env.LIGHTKEEPR_TOKEN,
    runId: argv.runId || process.env.LIGHTKEEPR_RUN_ID,
  });
}

export default {
  command: "stop",
  desc: "Finishes running build",

  builder: (yargs) =>
    yargs
      .option("apiUrl", {
        description: "API url used to send the lighthouse report to",
        default: "https://lightkeepr.vercel.app/api",
      })
      .option("token", {
        description: "Project API token",
      })
      .option("runId", {
        description: "Run ID to stop",
      }),

  handler: (argv) => {
    runStop(argv).catch(console.error);
  },
};
