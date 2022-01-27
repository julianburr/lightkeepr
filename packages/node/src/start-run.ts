import fetch from "node-fetch";

import { API_URL } from "./utils/constants";
import { report, ReportArgs } from "./report";
import { stopRun, StopRunArgs } from "./stop-run";
import { userFlow, UserFlowArgs } from "./user-flow";

type StartRunArgs = {
  token?: string;
  apiUrl?: string;
  branch?: string;
  commitMessage?: string;
  repo?: string;
};

export async function startRun({
  token = global.process.env.LIGHTKEEPR_TOKEN,
  apiUrl = global.process.env.LIGHTKEEPR_API_URL || API_URL,
  branch = global.process.env.LIGHTKEER_BRANCH,
  commitMessage = global.process.env.LIGHTKEER_COMMIT_MESSAGE,
  repo = global.process.env.LIGHTKEER_REPO,
}: StartRunArgs = {}): Promise<any> {
  const res = await fetch(`${apiUrl}/runs/start`, {
    method: "POST",
    body: JSON.stringify({ branch, commitMessage, repo }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data: any = await res.json();
  if (res.status >= 400) {
    throw new Error(data.message);
  }

  return {
    ...data,

    // Add basic methods pre-filling some of the args
    report: (args: ReportArgs) =>
      report({ ...args, runId: data.id, token, apiUrl }),
    userFlow: (args: UserFlowArgs) =>
      userFlow({ ...args, runId: data.id, token, apiUrl }),
    stopRun: (args: StopRunArgs) =>
      stopRun({ ...args, runId: data.id, token, apiUrl }),
  };
}
