import fetch from "node-fetch";

import { API_URL } from "./utils/constants";

export type StopRunArgs = {
  token?: string;
  runId?: string;
  statusCode?: number;
  error?: any;
  apiUrl?: string;
};

export async function stopRun({
  token = global.process.env.LIGHTKEEPR_TOKEN,
  apiUrl = global.process.env.LIGHTKEEPR_API_URL || API_URL,
  runId = global.process.env.LIGHTKEEPR_RUN_ID,
  statusCode = 0,
  error,
}: StopRunArgs = {}): Promise<any> {
  const res = await fetch(`${apiUrl}/runs/${runId}/stop`, {
    method: "POST",
    body: JSON.stringify({ statusCode, error }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data: any = await res.json();
  if (res.status >= 400) {
    throw new Error(data.message);
  }

  return data;
}
