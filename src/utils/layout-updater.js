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

  // Check if the file is TypeScript or JavaScript
  const isTypeScript = layoutFilePath.endsWith(".tsx");

  // Import statement to add
  const importStatement = `import metadata from '../../next-metadata';\n`;

  // Regular expressions to find and replace metadata
  const metadataExportRegex = /export\s+const\s+metadata\s*=\s*{[\s\S]*?};/;
  const metadataObjectRegex = /export\s+const\s+metadata/;

  // Check if the layout file already has a metadata export
  if (metadataExportRegex.test(layoutContent)) {
    // Replace existing metadata export with our import
    const updatedContent = layoutContent.replace(
      metadataExportRegex,
      "export const metadata = metadata;"
    );

    // Add the import statement
    const finalContent = addImportToContent(updatedContent, importStatement);

    fs.writeFileSync(layoutFilePath, finalContent);
  } else if (metadataObjectRegex.test(layoutContent)) {
    // If there's a simpler metadata declaration, replace it
    const updatedContent = layoutContent.replace(
      metadataObjectRegex,
      "export const metadata"
    );

    // Add the import statement
    const finalContent = addImportToContent(updatedContent, importStatement);

    fs.writeFileSync(layoutFilePath, finalContent);
  } else {
    // If no metadata export is found, add both import and export
    const metadataExport = "export const metadata = metadata;\n\n";
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
