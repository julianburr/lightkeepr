import lighthouse from "lighthouse";
import chromeLauncher from "chrome-launcher";

import { createReport } from "./utils/create-report";
import { cleanReportData } from "./utils/clean-report-data";
import { API_URL } from "./utils/constants";

type ReportArgs = {
  runId: string;
  url: string;
  apiUrl?: string;
};

export async function report({ runId, url, apiUrl = API_URL }: ReportArgs) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
  const result = await lighthouse("https://example.com", { output: "json" });
  const reportData = cleanReportData(result.report);
  await chrome.kill();

  const response = await createReport({ apiUrl, runId, name: url, reportData });
  return response;
}
