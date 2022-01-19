import * as fs from "fs";
import * as path from "path";
import fetch from "node-fetch";
import spawn from "cross-spawn";
import brotli from "brotli";
import FormData from "form-data";
import { v4 as uuid } from "uuid";
import pako from "pako";

type StartBuildArgs = {
  token: string;
  apiUrl: string;
  branch?: string;
  commit?: string;
  repo?: string;
};

export async function startBuild({
  token,
  apiUrl,
  branch,
  commit,
  repo,
}: StartBuildArgs) {
  return fetch(`${apiUrl}/builds/start`, {
    method: "POST",
    body: JSON.stringify({ branch, commit, repo }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}

type StopBuildArgs = {
  token: string;
  statusCode?: number;
  apiUrl: string;
  buildId: string;
};

export async function stopBuild({
  token,
  statusCode,
  apiUrl,
  buildId,
}: StopBuildArgs) {
  const res = await fetch(`${apiUrl}/builds/${buildId}/stop`, {
    method: "POST",
    body: JSON.stringify({ statusCode }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
  console.log({ res });
  return res;
}

type ReportArgs = {
  token: string;
  apiUrl: string;
  buildId: string;
  url: string;
};

export async function report({ token, apiUrl, buildId, url }: ReportArgs) {
  const lighthouseBin = path.resolve(
    __dirname,
    "../node_modules/.bin/lighthouse"
  );

  const report = await new Promise<string>((resolve, reject) => {
    let data = "";
    const p = spawn(lighthouseBin, [
      url,
      '--chrome-flags="--headless"',
      "--output=json",
      "--quiet",
    ]);

    p.stdout.on("data", (d) => {
      data += d;
    });

    p.on("error", reject);
    p.on("close", () => resolve(data));
  });

  const content = JSON.stringify(JSON.parse(report));
  const compressed = pako.deflate(content);
  const compressedStr = Buffer.from(compressed).toString("base64");
  console.log({ compressedStr });

  const tmpPath = path.resolve(__dirname, `./tmp${uuid()}.brotli`);
  fs.writeFileSync(tmpPath, compressedStr);
  const stream = fs.createReadStream(tmpPath);

  const formData = new FormData();
  formData.append("buildId", buildId);
  formData.append("url", url);
  formData.append("file", stream);

  const response = await fetch(`${apiUrl}/reports/create`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log({ response });
  const res = await response.json();
  console.log({ res });

  fs.unlinkSync(tmpPath);

  return res;
}
