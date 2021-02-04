const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const spawn = require("cross-spawn");
const brotli = require("brotli");
const FormData = require("form-data");
const { v4: uuid } = require("uuid");

async function startBuild({ token, apiUrl }) {
  return fetch(`${apiUrl}/builds/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}

async function stopBuild({ token, statusCode, apiUrl }) {
  return fetch(`${apiUrl}/builds/${build.id}/end`, {
    method: "POST",
    body: JSON.stringify({ statusCode }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
}

async function report({ token, apiUrl, buildId, url }) {
  const lighthouseBin = path.resolve(
    __dirname,
    "../node_modules/.bin/lighthouse"
  );

  const report = await new Promise((resolve, reject) => {
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
  const compressed = brotli.compress(Buffer.from(content));

  const tmpPath = path.resolve(__dirname, `./tmp${uuid()}.brotli`);
  fs.writeFileSync(tmpPath, compressed);
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

  fs.unlinkSync(tmpPath);

  return res;
}

module.exports = { startBuild, stopBuild, report };
