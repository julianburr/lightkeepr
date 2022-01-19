import { Parcel } from "@parcel/core";
import glob from "glob";
import yargs from "yargs";

const argv = yargs(process.argv).argv;
const entries = glob.sync("./*/").filter((p) => p !== "./node_modules/");

let bundler = new Parcel({
  entries,
  defaultConfig: "@parcel/config-default",
});

try {
  if (argv.watch) {
    await bundler.watch((err, event) => {
      if (err) {
        throw err;
      }

      if (event.type === "buildSuccess") {
        let bundles = event.bundleGraph.getBundles();
        console.log(
          `[watch] ✨ Built ${bundles.length} bundles in ${event.buildTime}ms!`
        );
      } else if (event.type === "buildFailure") {
        console.log(event.diagnostics);
      }
    });
  } else {
    let { bundleGraph, buildTime } = await bundler.run();
    let bundles = bundleGraph.getBundles();
    console.log(
      `[build] ✨ Built ${bundles.length} bundles in ${buildTime}ms!`
    );
  }
} catch (err) {
  console.log(err.diagnostic);
}
