const core = require("@actions/core");

const fs = require("fs");
const path = require("path");
const glob = require("glob");

try {
  const packagesRoot = core.getInput("packagesRoot", { required: true });
  const packageJsons = glob
    .sync("**/package.json", path.resolve(process.cwd(), packagesRoot))
    .filter(
      (filePath) =>
        filePath !== "package.json" && !filePath.includes("node_modules")
    );

  console.log({ packageJsons });

  // packageJsons.forEach((filePath) => {
  //   const absPath = path.resolve(process.cwd(), filePath);
  //   const content = fs.readFileSync(absPath, "utf-8");
  //   const packageJson = JSON.parse(content);

  //   const tagName = `${packageJson.name}@${packageJson.version}`;
  // });
} catch (e) {
  core.setFailed(error.message);
}
