import * as fs from "fs";
import * as path from "path";
import puppeteer from "puppeteer";
import { startFlow } from "lighthouse/lighthouse-core/fraggle-rock/api.js";

import { createReport } from "./utils/create-report";
import { API_URL } from "./utils/constants";
import { cleanReportData } from "./utils/clean-report-data";

export type UserFlowArgs = {
  token?: string;
  runId?: string;
  name: string;
  apiUrl?: string;
  options?: any;
};

export async function userFlow({
  token = global.process.env.LIGHTKEEPR_TOKEN,
  apiUrl = global.process.env.LIGHTKEEPR_API_URL || API_URL,
  runId = global.process.env.LIGHTKEEPR_RUN_ID,
  name,
  options = {},
}: UserFlowArgs) {
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  const flow = await startFlow(page, { name });

  flow.stop = async () => {
    await browser.close();
    fs.writeFileSync(
      path.resolve(process.cwd(), "./report.html"),
      flow.generateReport()
    );
    const flowReport = flow.getFlowResult();
    const reportData = {
      ...flowReport,
      steps: flowReport.steps.map((step) => ({
        ...step,
        lhr: cleanReportData(step.lhr),
      })),
    };

    const response = await createReport({
      token,
      apiUrl,
      runId,
      type: "user-flow",
      name: reportData.name,
      reportData,
    });
    return response;
  };

  return { browser, page, flow };
}
