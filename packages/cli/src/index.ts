#! /usr/bin/env node

import d from "debug";
import yargs from "yargs";

const debug = d("LIGHTKEEPR");

const argv = yargs
  .commandDir("commands")
  .demandCommand()
  .help("h")
  .alias("h", "help")
  .version()
  .alias("v", "version").argv;

debug(`argv: ${JSON.stringify(argv)}`);

export {};
