#! /usr/bin/env node

const debug = require("debug")("LIGHTKEEPR");

const argv = require("yargs")
  .commandDir("commands")
  .demandCommand()
  .help("h")
  .alias("h", "help")
  .version()
  .alias("v", "version").argv;

debug(`argv: ${JSON.stringify(argv)}`);
