#! /usr/bin/env node

import d from "debug";
import yargs from "yargs";

import startCommand from "./commands/start";
import reportCommand from "./commands/report";
import stopCommand from "./commands/stop";
import execCommand from "./commands/exec";

const debug = d("LIGHTKEEPR");

const argv = yargs
  .scriptName("lightkeepr")
  .command(startCommand)
  .command(reportCommand)
  .command(stopCommand)
  .command(execCommand)
  .help("h")
  .alias("h", "help")
  .version()
  .alias("v", "version").argv;

debug(`argv: ${JSON.stringify(argv)}`);

export {};
