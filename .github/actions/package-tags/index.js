const core = require("@actions/core");
const github = require("@actions/github");

const fs = require("fs");
const path = require("path");
const glob = require("glob");

async function run() {
  console.log({ env: process.env });
  const { GITHUB_REF, GITHUB_SHA, GITHUB_TOKEN } = process.env;
  const octokit = github.getOctokit(GITHUB_TOKEN);

  const tags = await octokit.repos.listTags({
    ...github.context.repo,
    per_page: 100,
  });

  const packagesRoot = core.getInput("packages_root", { required: true });
  const packageJsons = glob
    .sync("**/package.json", path.resolve(process.cwd(), packagesRoot))
    .filter(
      (filePath) =>
        filePath !== "package.json" && !filePath.includes("node_modules")
    );

  console.log({ packageJsons, tags, GITHUB_REF, GITHUB_SHA });

  //   annotatedTag = await octokit.git.createTag({
  //     ...github.context.repo,
  //     tag: newTag,
  //     message: newTag,
  //     object: GITHUB_SHA,
  //     type: 'commit',
  //   });
  // }

  // core.debug(`Pushing new tag to the repo.`);
  // await octokit.git.createRef({
  //   ...github.context.repo,
  //   ref: `refs/tags/${newTag}`,
  //   sha: annotatedTag ? annotatedTag.data.sha : GITHUB_SHA,
  // });

  // packageJsons.forEach((filePath) => {
  //   const absPath = path.resolve(process.cwd(), filePath);
  //   const content = fs.readFileSync(absPath, "utf-8");
  //   const packageJson = JSON.parse(content);

  //   const tagName = `${packageJson.name}@${packageJson.version}`;
  // });
}

try {
  run();
} catch (e) {
  core.setFailed(error.message);
}
