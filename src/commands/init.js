const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const fileManager = require("../utils/file-manager");
const layoutUpdater = require("../utils/layout-updater");

async function init() {
  console.log(chalk.blue("Initializing Next.js SEO Metadata configuration..."));

  try {
    // Check if we're in a Next.js project
    if (!fileManager.isNextJsProject()) {
      console.log(
        chalk.red("Error: This doesn't seem to be a Next.js project.")
      );
      console.log(
        chalk.yellow(
          "Please run this command in the root of a Next.js project."
        )
      );
      return;
    }

    // Get user inputs
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "siteName",
        message: "What is your website name?",
        default: path.basename(process.cwd()),
      },
      {
        type: "input",
        name: "siteUrl",
        message: "What is your website URL?",
        default: "https://example.com",
      },
      {
        type: "input",
        name: "siteDescription",
        message: "Enter a brief description of your website:",
        default: "My awesome Next.js website",
      },
      {
        type: "confirm",
        name: "updateLayout",
        message:
          "Would you like to update your layout.tsx/js file with the new metadata?",
        default: true,
      },
    ]);

    // Create the metadata configuration file
    const metadataFilePath = fileManager.createMetadataFile(answers);
    console.log(
      chalk.green(
        `✅ Created metadata configuration file at ${chalk.bold(
          metadataFilePath
        )}`
      )
    );

    // Update the layout file if requested
    if (answers.updateLayout) {
      const layoutFilePath = layoutUpdater.updateLayoutFile();
      if (layoutFilePath) {
        console.log(
          chalk.green(`✅ Updated layout file at ${chalk.bold(layoutFilePath)}`)
        );
      } else {
        console.log(chalk.yellow("⚠️ Could not find a layout file to update."));
      }
    }

    console.log(chalk.blue("\nSetup complete! 🎉"));
    console.log(
      chalk.blue(
        "You can now manage your Next.js metadata in the next-metadata.js file."
      )
    );
  } catch (error) {
    console.error(chalk.red("An error occurred during initialization:"));
    console.error(error);
    process.exit(1);
  }
}

module.exports = init;
