import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

import { createReport } from "./utils/create-report";
import { cleanReportData } from "./utils/clean-report-data";
import { API_URL } from "./utils/constants";

export type ReportArgs = {
  token?: string;
  apiUrl?: string;
  runId?: string;
  url: string;
};

export async function report({
  token: _token,
  apiUrl: _apiUrl,
  runId: _runId,
  url,
}: ReportArgs) {
  const token = _token || process.env.LIGHTKEEPR_TOKEN;
  const apiUrl = _apiUrl || process.env.LIGHTKEEPR_API_URL || API_URL;
  const runId = _runId || process.env.LIGHTKEEPR_RUN_ID;

  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
  const result = await lighthouse(url, { output: "json", port: chrome.port });
  const reportData = cleanReportData(JSON.parse(result.report));
  await chrome.kill();

  const response = await createReport({
    token,
    runId,
    apiUrl,
    name: url,
    reportData,
  });
  return response;
}
