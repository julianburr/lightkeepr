const core = require("@actions/core");
const github = require("@actions/github");

const fs = require("fs");
const path = require("path");
const glob = require("glob");

async function run() {
  const { GITHUB_REF, GITHUB_SHA } = process.env;

  const githubToken = core.getInput("github_token");
  octokit = github.getOctokit(githubToken);

  const tags = await octokit.repos.listTags({ ...context.repo, per_page: 100 });

  const packagesRoot = core.getInput("packages_root", { required: true });
  const packageJsons = glob
    .sync("**/package.json", path.resolve(process.cwd(), packagesRoot))
    .filter(
      (filePath) =>
        filePath !== "package.json" && !filePath.includes("node_modules")
    );

  console.log({ packageJsons, tags, GITHUB_REF, GITHUB_SHA });

  //   annotatedTag = await octokit.git.createTag({
  //     ...context.repo,
  //     tag: newTag,
  //     message: newTag,
  //     object: GITHUB_SHA,
  //     type: 'commit',
  //   });
  // }

  // core.debug(`Pushing new tag to the repo.`);
  // await octokit.git.createRef({
  //   ...context.repo,
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
