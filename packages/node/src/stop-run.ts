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
  token: _token,
  apiUrl: _apiUrl,
  runId: _runId,
  statusCode = 0,
  error,
}: StopRunArgs = {}): Promise<any> {
  const token = _token || process.env.LIGHTKEEPR_TOKEN;
  const apiUrl = _apiUrl || process.env.LIGHTKEEPR_API_URL || API_URL;
  const runId = _runId || process.env.LIGHTKEEPR_RUN_ID;

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
