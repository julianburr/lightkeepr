import fetch from "node-fetch";

import { API_URL } from "./utils/constants";

type StartRunArgs = {
  token: string;
  apiUrl: string;
  branch?: string;
  commitMessage?: string;
  repo?: string;
};

export async function startRun({
  branch,
  commitMessage,
  repo,
  apiUrl = API_URL,
}: StartRunArgs): Promise<any> {
  const res = await fetch(`${apiUrl}/runs/create`, {
    method: "POST",
    body: JSON.stringify({ branch, commitMessage, repo }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${global.process.env.LIGHTKEEPR_TOKEN}`,
    },
  });

  const data = await res.json();
  if (res.status >= 400) {
    throw new Error(res.message);
  }

  return data;
}
