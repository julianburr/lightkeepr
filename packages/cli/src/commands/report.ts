import { report } from "@lightkeepr/node";

async function runReport(argv) {
  return report({
    apiUrl: argv.apiUrl || process.env.LIGHTKEEPR_API_URL,
    token: argv.token || process.env.LIGHTKEEPR_TOKEN,
    runId: argv.runId || process.env.LIGHTKEEPR_BUILD_ID,
    url: argv.url,
  });
}

export default {
  command: "report",
  desc: "Creates lighthouse report and sends it to server",

  builder: (yargs) =>
    yargs
      .option("url", {
        description: "URL to run report on",
      })
      .option("dir", {
        description: "Folder to serve to run report on",
      })
      .option("apiUrl", {
        description: "API url used to send the lighthouse report to",
        default: "https://lightkeepr.vercel.app/api",
      })
      .option("token", {
        description: "Project API token",
      })
      .option("runId", {
        description: "Run ID for the report",
      }),

  handler: (argv) => {
    runReport(argv).catch(console.error);
  },
};
