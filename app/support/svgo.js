const fs = require("fs");
const path = require("path");

const glob = require("glob");
const { optimize: svgoOptimise } = require("svgo");

const assetsPath = path.resolve(process.cwd(), "./src/assets");
const files = glob.sync("**/*.svg", { cwd: assetsPath });

async function optimize(content, prefix) {
  return new Promise((yay, nay) => {
    const options = {
      plugins: [
        {
          name: "removeViewBox",
          active: false,
        },
        {
          name: "prefixIds",
          active: true,
          params: {
            prefixIds: true,
            prefixClassNames: true,
            prefix,
          },
        },
      ],
    };
    const result = svgoOptimise(content, options);
    if (result && result.data) {
      yay(result.data);
    } else {
      nay(new Error("Something went wrong"));
    }
  });
}

async function run() {
  for (const filePath of files) {
    try {
      const absPath = path.resolve(assetsPath, filePath);
      console.log({ filePath, absPath });
      const content = fs.readFileSync(absPath, "utf8");
      const prefix = filePath.replace(/\//g, "--").replace(".svg", "");
      const result = await optimize(content, prefix);
      fs.writeFileSync(absPath, result, "utf-8");
    } catch (e) {
      console.error(e);
    }
  }
}

run();
