#!/usr/bin/env node

const { Command } = require("commander");
const version = require("../package").version;
const OptionKeys = require("../src/options").keys;
const Generator = require("../src/generate");
const program = new Command();
const filecopy = require("../src/util/filecopy");
process.title = "icont-cli";

program
  .version(version, "-v, --version")
  .description("Convert SVG(s) to ttf file")
  .requiredOption(
    "-i, --" + OptionKeys.input + " <path|dir>",
    "input svg dir or file path",
    undefined
  )
  .option("-o, --" + OptionKeys.output + " <dir>", "output path", "output")
  .option(
    "-n, --" + OptionKeys.fontname + " <name>",
    "output font name",
    "iconfonts"
  )
  .option("--verbose", "verbose", false)
  .action(function (cmd, args) {
    let options = {};
    for (let key in OptionKeys) {
      options[key] = cmd[key];
    }
    Generator(options);
  });

program.on("option:verbose", function () {
  process.env.VERBOSE = this.verbose;
});

program.on("command:*", function (operands) {
  console.error(`error: unknown command '${operands[0]}'`);
  process.exitCode = 1;
});

program
  .command("copy")
  .description("copy file to target dir.")
  .requiredOption("-d, --dist <dir>", "dist dir", undefined)
  .requiredOption("-s, --src <dir>", "copy form dir", undefined)
  .requiredOption("-e, --ext <extname>", "file ext name", undefined)
  .action((cmd) => {
    filecopy(cmd.src, cmd.dist, cmd.ext);
  });

program.parse(process.argv);
