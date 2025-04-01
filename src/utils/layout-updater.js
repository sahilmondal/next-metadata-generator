const fs = require("fs-extra");
const path = require("path");
const fileManager = require("./file-manager");

/**
 * Update the Next.js layout file to use our metadata configuration
 */
function updateLayoutFile() {
  const layoutFiles = fileManager.findLayoutFiles();

  if (layoutFiles.length === 0) {
    return null;
  }

  // Use the first layout file found
  const layoutFilePath = layoutFiles[0];
  const layoutContent = fs.readFileSync(layoutFilePath, "utf8");

  // Check if the file is TypeScript or JavaScript and in src directory
  const isTypeScript = layoutFilePath.endsWith(".tsx");
  const isInSrcDir = layoutFilePath.includes(path.join("src", "app"));

  // Check if the project uses TypeScript
  const useTypeScript = fileManager.isTypeScriptProject();
  const metadataExtension = useTypeScript ? ".ts" : ".js";

  // Determine the correct import path based on directory structure
  const importPath = isInSrcDir
    ? `../../next-metadata${metadataExtension}`
    : `../next-metadata${metadataExtension}`;

  // Import statement to add - using nextMetadata as variable name to avoid conflicts
  const importStatement = `import nextMetadata from '${importPath}';\n`;

  // Regular expressions to find and replace metadata
  const metadataExportRegex =
    /export\s+const\s+metadata(?:\s*:\s*Metadata)?\s*=\s*{[\s\S]*?};/;

  // Check if the layout file already has a metadata export
  if (metadataExportRegex.test(layoutContent)) {
    // Replace existing metadata export with our import and simplified export
    const updatedContent = layoutContent.replace(
      metadataExportRegex,
      isTypeScript
        ? "export const metadata: Metadata = nextMetadata;"
        : "export const metadata = nextMetadata;"
    );

    // Add the import statement
    const finalContent = addImportToContent(updatedContent, importStatement);

    fs.writeFileSync(layoutFilePath, finalContent);
  } else {
    // If no metadata export is found, add both import and export
    const metadataExport = isTypeScript
      ? "export const metadata: Metadata = nextMetadata;\n\n"
      : "export const metadata = nextMetadata;\n\n";

    const finalContent = addImportToContent(
      layoutContent,
      importStatement + metadataExport
    );

    fs.writeFileSync(layoutFilePath, finalContent);
  }

  return layoutFilePath;
}

/**
 * Add an import statement to the content at the appropriate position
 */
function addImportToContent(content, importStatement) {
  // Find the last import statement
  const importRegex = /import\s+.*from\s+['"].*['"];?/g;
  const imports = [...content.matchAll(importRegex)];

  if (imports.length > 0) {
    // Get the last import statement and its position
    const lastImport = imports[imports.length - 1];
    const lastImportIndex = lastImport.index + lastImport[0].length;

    // Insert our import after the last import
    return (
      content.substring(0, lastImportIndex) +
      "\n" +
      importStatement +
      content.substring(lastImportIndex)
    );
  } else {
    // If no imports found, add at the beginning of the file
    return importStatement + content;
  }
}

module.exports = {
  updateLayoutFile,
};
