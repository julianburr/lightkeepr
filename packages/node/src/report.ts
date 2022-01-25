import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

import { createReport } from "./utils/create-report";
import { cleanReportData } from "./utils/clean-report-data";
import { API_URL } from "./utils/constants";

type ReportArgs = {
  token?: string;
  runId?: string;
  url: string;
  apiUrl?: string;
};

export async function report({
  token = process.env.LIGHTKEEPR_TOKEN,
  runId = process.env.LIGHTKEEPR_RUN_ID,
  url,
  apiUrl = API_URL,
}: ReportArgs) {
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
