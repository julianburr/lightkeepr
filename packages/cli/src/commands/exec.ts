import spawn from "cross-spawn";
import { startBuild, stopBuild } from "@lightkeepr/node";

import { getEnv } from "../utils/env";

async function runExec(argv) {
  const [_, command, ...commandArgv] = argv._;

  let env = getEnv(argv);
  if (!env.LIGHTKEEPR_TOKEN) {
    throw new Error("No token defined");
  }

  const build = await startBuild({
    apiUrl: env.LIGHTKEEPR_API_URL,
    token: env.LIGHTKEEPR_TOKEN,
  });

  if (!build.id) {
    throw new Error("Build creation failed");
  }

  env.LIGHTKEEPR_BUILD_ID = build.id;

  const status = await new Promise<number>((resolve, reject) => {
    spawn(command, commandArgv, { stdio: "inherit", env })
      .on("error", reject)
      .on("close", resolve);
  });

  await stopBuild({
    apiUrl: env.LIGHTKEEPR_API_URL,
    token: env.LIGHTKEEPR_TOKEN,
    buildId: env.LIGHTKEEPR_BUILD_ID,
  });
  process.exit(status);
}

export default {
  command: "exec",
  desc: "Will create lightkeepr build and run given command",

  builder: (yargs) =>
    yargs
      .option("apiUrl", {
        description: "API url used to send the lighthouse report to",
        default: "https://lightkeepr-server.vercel.app",
      })
      .option("token", {
        description: "Project API token",
      }),

  handler: (argv) => {
    runExec(argv).catch(console.error);
  },
};
