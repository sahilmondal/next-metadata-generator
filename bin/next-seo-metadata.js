#!/usr/bin/env node

const { program } = require("commander");
const pkg = require("../package.json");
const init = require("../src/commands/init");

program.version(pkg.version).description(pkg.description);

program
  .command("init")
  .description("Initialize a new Next.js metadata configuration")
  .action(init);

program.parse(process.argv);

// If no command is provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
