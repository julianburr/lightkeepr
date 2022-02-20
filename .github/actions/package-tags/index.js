const core = require("@actions/core");
const github = require("@actions/github");

const fs = require("fs");
const path = require("path");
const glob = require("glob");

async function run() {
  const { GITHUB_SHA, GITHUB_TOKEN } = process.env;
  const octokit = github.getOctokit(GITHUB_TOKEN);

  const tags = await octokit.rest.repos.listTags({
    ...github.context.repo,
    per_page: 100,
  });

  const packagesRoot = core.getInput("packages_root", { required: true });
  const rootPath = path.resolve(process.cwd(), packagesRoot);

  const packageJsons = glob
    .sync("**/package.json", { cwd: rootPath })
    .filter(
      (filePath) =>
        filePath !== "package.json" && !filePath.includes("node_modules")
    );

  const currentTags = packageJsons.map((filePath) => {
    const absPath = path.resolve(rootPath, filePath);
    const content = fs.readFileSync(absPath, "utf-8");
    const packageJson = JSON.parse(content);

    const tagName = `${packageJson.name}@${packageJson.version}`;
    return tagName;
  });

  const missingTags = currentTags.filter(
    (tag) => !tags.data.find((t) => t.name === tag)
  );

  for (const tagName of missingTags) {
    annotatedTag = await octokit.git.createTag({
      ...github.context.repo,
      tag: tagName,
      message: tagName,
      object: GITHUB_SHA,
      type: "commit",
    });

    await octokit.git.createRef({
      ...github.context.repo,
      ref: `refs/tags/${tagName}`,
      sha: annotatedTag ? annotatedTag.data.sha : GITHUB_SHA,
    });
  }
}

try {
  run();
} catch (e) {
  core.setFailed(error.message);
}
