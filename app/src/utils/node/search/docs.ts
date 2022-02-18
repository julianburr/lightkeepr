import * as path from "path";

import { glob } from "glob";

import { search } from "./base";

export async function getFiles() {
  const docsDir = path.resolve(process.cwd(), "../docs");
  const docs = glob
    .sync("**/*.md", { cwd: docsDir })
    .filter((filePath) => !filePath.includes("node_modules"))
    .filter((filePath) => filePath !== "README.md")
    .map((filePath) => ({
      filePath,
      slug: filePath
        .replace(/^index\.md$/, "")
        .replace(/\/README\.md$/, "")
        .replace(/\.md$/, "")
        .split("/"),
      absPath: path.resolve(docsDir, filePath),
    }));

  const packagesDir = path.resolve(process.cwd(), "../packages");
  const packages = glob
    .sync("**/README.md", { cwd: packagesDir })
    .filter((filePath) => !filePath.includes("node_modules"))
    .map((filePath) => ({
      filePath: `packages/${filePath}`,
      slug: `packages/${filePath}`
        .replace(/^index\.md$/, "")
        .replace(/\/README\.md$/, "")
        .replace(/\.md$/, "")
        .split("/"),
      absPath: path.resolve(packagesDir, filePath),
    }));

  return [...docs, ...packages];
}

export async function searchDocs(searchTerm: string) {
  const files = await getFiles();
  return search("docs", files, searchTerm);
}
