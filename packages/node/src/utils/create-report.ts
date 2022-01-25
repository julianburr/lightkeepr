import * as fs from "fs";
import * as path from "path";
import fetch from "node-fetch";
import FormData from "form-data";
import createCompress from "compress-brotli";
import { v4 as uuid } from "uuid";

const { compress } = createCompress();

type CreateReportArgs = {
  apiUrl: string;
  runId: string;
  name: string;
  type?: string;
  reportData: any;
};

export async function createReport({
  apiUrl,
  runId,
  name,
  type,
  reportData,
}: CreateReportArgs) {
  const content = JSON.stringify(reportData);
  const compressedStr = await compress(content);

  const tmpPath = path.resolve(global.process.cwd(), `./tmp--${uuid()}.brotli`);
  fs.writeFileSync(tmpPath, compressedStr);
  const stream = fs.createReadStream(tmpPath);

  const formData = new FormData();

  // Basic data
  formData.append("runId", runId);
  formData.append("name", name);
  if (type) formData.append("type", type);

  // Compressed report json file
  formData.append("file", stream);

  const res = await fetch(`${apiUrl}/runs/${runId}/report`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${global.process.env.LIGHTKEEPR_TOKEN}`,
    },
  });

  fs.unlinkSync(tmpPath);

  const data = await res.json();
  if (res.status >= 400) {
    throw new Error(res.message);
  }

  return data;
}
