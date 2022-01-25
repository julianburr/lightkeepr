import spawn from "cross-spawn";
import { startRun, stopRun } from "@lightkeepr/node";

async function runExec(argv) {
  const [_, command, ...commandArgv] = argv._;

  const token = argv.token || process.env.LIGHTKEEPR_TOKEN;
  if (!token) {
    throw new Error("No token defined");
  }

  const apiUrl = argv.apiUrl || process.env.LIGHTKEEPR_API_URL;
  const build = await startRun({ apiUrl, token });

  if (!build.id) {
    throw new Error("Build creation failed");
  }

  const runId = argv.runId || process.env.LIGHTKEEPR_RUN_ID;

  const status = await new Promise<number>((resolve, reject) => {
    spawn(command, commandArgv, { stdio: "inherit" })
      .on("error", reject)
      .on("close", resolve);
  });

  await stopRun({ apiUrl, token, runId });
  process.exit(status);
}

export default {
  command: "exec",
  desc: "Will create lightkeepr build and run given command",

  builder: (yargs) =>
    yargs
      .option("apiUrl", {
        description: "API url used to send the lighthouse report to",
        default: "https://lightkeepr.vercel.app/api",
      })
      .option("token", {
        description: "Project API token",
      }),

  handler: (argv) => {
    runExec(argv).catch(console.error);
  },
};
