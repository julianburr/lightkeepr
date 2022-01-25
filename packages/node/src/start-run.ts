import fetch from "node-fetch";

import { API_URL } from "./utils/constants";

type StartRunArgs = {
  token?: string;
  apiUrl?: string;
  branch?: string;
  commitMessage?: string;
  repo?: string;
};

export async function startRun({
  token = process.env.LIGHTKEEPR_TOKEN,
  branch,
  commitMessage,
  repo,
  apiUrl = API_URL,
}: StartRunArgs): Promise<any> {
  const res = await fetch(`${apiUrl}/runs/start`, {
    method: "POST",
    body: JSON.stringify({ branch, commitMessage, repo }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (res.status >= 400) {
    throw new Error(data.message);
  }

  return data;
}
