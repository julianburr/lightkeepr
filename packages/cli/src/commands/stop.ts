import { stopRun } from "@lightkeepr/node";

function runStop(argv) {
  return stopRun({
    apiUrl: argv.apiUrl,
    token: argv.token,
    runId: argv.runId,
  });
}

export default {
  command: "stop",
  desc: "Finishes running build",

  builder: (yargs) =>
    yargs
      .option("apiUrl", {
        description: "API url used to send the lighthouse report to",
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
