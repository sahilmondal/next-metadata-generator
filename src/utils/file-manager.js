const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

const TEMPLATE_DIR = path.resolve(__dirname, "../templates");
const METADATA_FILENAME = "next-metadata.template";

/**
 * Check if the current directory is a Next.js project
 */
function isNextJsProject() {
  try {
    const packageJsonPath = path.join(process.cwd(), "package.json");
    if (!fs.existsSync(packageJsonPath)) {
      return false;
    }

    const packageJson = require(packageJsonPath);
    return (
      (packageJson.dependencies && packageJson.dependencies.next) ||
      (packageJson.devDependencies && packageJson.devDependencies.next)
    );
  } catch (error) {
    return false;
  }
}

/**
 * Create the metadata configuration file
 */
function createMetadataFile(answers) {
  const templatePath = path.join(TEMPLATE_DIR, `${METADATA_FILENAME}.js`);
  const targetPath = path.join(process.cwd(), METADATA_FILENAME);

  // Read the template
  let template = fs.readFileSync(templatePath, "utf8");

  // Replace placeholders with user inputs
  template = template
    .replace(/{{siteName}}/g, answers.siteName)
    .replace(/{{siteUrl}}/g, answers.siteUrl)
    .replace(/{{siteDescription}}/g, answers.siteDescription);

  // Write the file
  fs.writeFileSync(targetPath, template);
  return targetPath;
}

/**
 * Find all potential layout files
 */
function findLayoutFiles() {
  const appDir = path.join(process.cwd(), "app");
  const srcAppDir = path.join(process.cwd(), "src", "app");

  let layoutPaths = [];

  if (fs.existsSync(appDir)) {
    const layoutPath = path.join(appDir, "layout.tsx");
    const jsLayoutPath = path.join(appDir, "layout.js");

    if (fs.existsSync(layoutPath)) layoutPaths.push(layoutPath);
    if (fs.existsSync(jsLayoutPath)) layoutPaths.push(jsLayoutPath);
  }

  if (fs.existsSync(srcAppDir)) {
    const layoutPath = path.join(srcAppDir, "layout.tsx");
    const jsLayoutPath = path.join(srcAppDir, "layout.js");

    if (fs.existsSync(layoutPath)) layoutPaths.push(layoutPath);
    if (fs.existsSync(jsLayoutPath)) layoutPaths.push(jsLayoutPath);
  }

  return layoutPaths;
}

module.exports = {
  isNextJsProject,
  createMetadataFile,
  findLayoutFiles,
};
