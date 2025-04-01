const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const glob = require("glob");

const TEMPLATE_DIR = path.resolve(__dirname, "../templates");
const TEMPLATE_PATH = "next-metadata.template.js";
const METADATA_FILENAME_JS = "next-metadata.js";
const METADATA_FILENAME_TS = "next-metadata.ts";

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
 * Check if the project uses TypeScript
 */
function isTypeScriptProject() {
  try {
    // Check for tsconfig.json
    const tsconfigPath = path.join(process.cwd(), "tsconfig.json");
    if (fs.existsSync(tsconfigPath)) {
      return true;
    }

    // Check for typescript dependency in package.json
    const packageJsonPath = path.join(process.cwd(), "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = require(packageJsonPath);
      return (
        (packageJson.dependencies && packageJson.dependencies.typescript) ||
        (packageJson.devDependencies && packageJson.devDependencies.typescript)
      );
    }

    // Check for .ts or .tsx files in the project
    const tsFiles = glob.sync("**/*.ts?(x)", {
      cwd: process.cwd(),
      ignore: ["**/node_modules/**", "**/dist/**", "**/build/**"],
    });

    return tsFiles.length > 0;
  } catch (error) {
    // Default to JavaScript if any error occurs
    return false;
  }
}

/**
 * Create the metadata configuration file with the appropriate extension
 */
function createMetadataFile(answers) {
  // Determine if we should use TypeScript
  const useTypeScript = isTypeScriptProject();
  const templatePath = path.join(TEMPLATE_DIR, `${TEMPLATE_PATH}`);
  const metadataFilename = useTypeScript
    ? METADATA_FILENAME_TS
    : METADATA_FILENAME_JS;
  const targetPath = path.join(process.cwd(), metadataFilename);

  // Read the template
  let template = fs.readFileSync(templatePath, "utf8");

  // Replace placeholders with user inputs
  template = template
    .replace(/{{siteName}}/g, answers.siteName)
    .replace(/{{siteUrl}}/g, answers.siteUrl)
    .replace(/{{siteDescription}}/g, answers.siteDescription);

  // Add TypeScript types if using TypeScript
  if (useTypeScript) {
    // Add type imports at the top of the file
    // const typeImports = `import type { Metadata } from 'next';\n\n`;

    // Add types to siteConfig
    template = template.replace(
      "const siteConfig = {",
      "const siteConfig: SiteConfig = {"
    );

    // Add interface for siteConfig
    const siteConfigInterface = `
/**
 * Site Configuration Interface
 */
interface SiteConfig {
  name: string;
  url: string;
  description: string;
  twitter: {
    handle: string;
    site: string;
    cardType: string;
  };
  openGraph: {
    type: string;
    locale: string;
    siteName: string;
  };
  icons: {
    icon: string;
    apple: Array<{ url: string }>;
  };
  defaultImage: string;
  keywords: string[];
  creator: string;
  publisher: string;
  themeColor: string;
  robots: {
    index: boolean;
    follow: boolean;
  };
}

`;

    // Add the type declarations to the template
    // template = typeImports + siteConfigInterface + template;
    template = siteConfigInterface + template;

    // Add Metadata type to the metadata object
    // template = template.replace(
    //   "const metadata = {",
    //   "const metadata: Metadata = {"
    // );
  }

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
  isTypeScriptProject,
  createMetadataFile,
  findLayoutFiles,
};
