#!/usr/bin/env node

const { program } = require("commander");
const pkg = require("../package.json");
const init = require("../src/commands/init");

program.version(pkg.version).description(pkg.description);

program
  .command("init")
  .description("Initialize a new Next.js metadata configuration")
  .action(init);

// If no command is provided, run init
if (!process.argv.slice(2).length) {
  program.parse(["node", "next-seo-metadata", "init"]);
} else {
  program.parse(process.argv);
}
