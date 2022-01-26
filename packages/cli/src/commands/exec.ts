import spawn from "cross-spawn";
import { startRun, stopRun } from "@lightkeepr/node";

async function runExec(argv) {
  const [_, command, ...commandArgv] = argv._;

  const run = await startRun({ apiUrl: argv.apiUrl, token: argv.token });
  if (!run.id) {
    throw new Error("Build creation failed");
  }

  const status = await new Promise<number>((resolve, reject) => {
    spawn(command, commandArgv, { stdio: "inherit" })
      .on("error", reject)
      .on("close", resolve);
  });

  await stopRun({ apiUrl: argv.apiUrl, token: argv.token, runId: run.id });
  process.exit(status);
}

export default {
  command: "exec",
  desc: "Will create lightkeepr build and run given command",

  builder: (yargs) =>
    yargs
      .option("apiUrl", {
        description: "API url used to send the lighthouse report to",
      })
      .option("token", {
        description: "Project API token",
      }),

  handler: (argv) => {
    runExec(argv).catch(console.error);
  },
};
