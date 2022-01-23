import { report } from "@lightkeepr/node";

import { getEnv } from "../utils/env";

async function runReport(argv) {
  const env = getEnv(argv);
  return report({
    apiUrl: env.LIGHTKEEPR_API_URL,
    token: env.LIGHTKEEPR_TOKEN,
    buildId: env.LIGHTKEEPR_BUILD_ID,
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
        default: "https://lightkeepr-server.vercel.app",
      })
      .option("token", {
        description: "Project API token",
      })
      .option("buildId", {
        description: "Build ID for the report",
      }),

  handler: (argv) => {
    runReport(argv).catch(console.error);
  },
};
