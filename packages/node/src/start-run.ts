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

console.log("#0", {
  LIGHTKEEPR_TOKEN: process.env.LIGHTKEEPR_TOKEN,
});

export async function startRun({
  token: _token,
  apiUrl: _apiUrl,
  branch,
  commitMessage,
  repo,
}: StartRunArgs = {}): Promise<any> {
  const token = _token || process.env.LIGHTKEEPR_TOKEN;
  const apiUrl = _apiUrl || process.env.LIGHTKEEPR_API_URL || API_URL;

  console.log("#1", {
    token,
    _token,
    LIGHTKEEPR_TOKEN: process.env.LIGHTKEEPR_TOKEN,
  });

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
