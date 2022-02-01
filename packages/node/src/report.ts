import merge from "merge";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/lighthouse-core/config/desktop-config";

import { createReport } from "./utils/create-report";
import { cleanReportData } from "./utils/clean-report-data";
import { API_URL } from "./utils/constants";

type LighthouseOptions = any;

export type ReportArgs = {
  token?: string;
  apiUrl?: string;
  runId?: string;
  url: string;
  name?: string;
  port?: number;
  desktop?: boolean;
  options?: LighthouseOptions;
};

export async function report({
  token = global.process.env.LIGHTKEEPR_TOKEN,
  apiUrl = global.process.env.LIGHTKEEPR_API_URL || API_URL,
  runId = global.process.env.LIGHTKEEPR_RUN_ID,
  url,
  name,
  port,
  desktop,
  options = {},
}: ReportArgs) {
  const lhConfig = desktop
    ? merge.recursive(desktopConfig, { settings: options })
    : { extends: "lighthouse:default", settings: options };

  let result: any;

  if (port) {
    // Custom port provided
    result = await lighthouse(url, { output: "json", port }, lhConfig);
  } else {
    // No port provided, so we start chrome ourselves and use that port
    // to generate the report
    const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
    result = await lighthouse(
      url,
      { output: "json", port: chrome.port },
      lhConfig
    );
    await chrome.kill();
  }

  if (!result || !result.report) {
    throw new Error("Could not retrieve Lighthouse report");
  }

  const response = await createReport({
    token,
    runId,
    apiUrl,
    url,
    name,
    reportData: cleanReportData(JSON.parse(result.report)),
  });
  return response;
}
