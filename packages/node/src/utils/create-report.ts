import * as fs from "fs";
import * as path from "path";
import fetch from "node-fetch";
import FormData from "form-data";
import createCompress from "compress-brotli";
import { v4 as uuid } from "uuid";

const { compress } = createCompress();

type CreateReportArgs = {
  token: string;
  apiUrl: string;
  runId: string;
  url: string;
  name?: string;
  type?: string;
  reportData: any;
};

export async function createReport({
  token,
  apiUrl,
  runId,
  url,
  name = url,
  type,
  reportData,
}: CreateReportArgs) {
  const content = JSON.stringify(reportData, null, 2);
  const compressedStr = await compress(content);

  const tmpPath = path.resolve(process.cwd(), `./tmp--${uuid()}.brotli`);
  fs.writeFileSync(tmpPath, compressedStr);

  const formData = new FormData();

  // Basic data
  formData.append("runId", runId);
  formData.append("url", url);
  formData.append("name", name);
  if (type) formData.append("type", type);

  // Compressed report json file
  const stream = fs.createReadStream(tmpPath);
  formData.append("file", stream);

  const res = await fetch(`${apiUrl}/runs/${runId}/report`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  fs.unlinkSync(tmpPath);

  const data: any = await res.json();
  if (res.status >= 400) {
    throw new Error(data.message);
  }

  return data;
}
