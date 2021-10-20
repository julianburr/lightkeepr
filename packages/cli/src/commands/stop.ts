import { stopBuild } from "@lightkeepr/node";
import { getEnv } from "../utils/env";

async function runStop(argv) {
  const env = getEnv(argv);
  return stopBuild({
    apiUrl: env.LIGHTKEEPR_API_URL,
    token: env.LIGHTKEEPR_TOKEN,
    buildId: env.LIGHTKEEPR_BUILD_ID,
  });
}

export default {
  command: "stop",
  desc: "Finishes running build",

  builder: (yargs) =>
    yargs
      .option("apiUrl", {
        description: "API url used to send the lighthouse report to",
        default: "https://lightkeepr-server.vercel.app",
      })
      .option("token", {
        description: "Project API token",
      })
      .option("buildId", {
        description: "Build ID to stop",
      }),

  handler: (argv) => {
    runStop(argv).catch(console.error);
  },
};
