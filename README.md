# Next SEO Metadata

A CLI tool to generate and manage Next.js metadata for better SEO.

## Features

- 🚀 **Simple Setup**: One command to set up a comprehensive metadata configuration
- 🔄 **Centralized Management**: All your metadata in one file
- 🧩 **Variable System**: Define site-wide values once, use them everywhere
- 📱 **App Router Compatible**: Works with Next.js App Router
- 🔄 **Automatic Layout Update**: Integrates with your existing layout files

## Installation

```bash
# Install globally
npm install -g next-seo-metadata

# OR run directly with npx
npx next-seo-metadata
```

## Usage

### Initialize Metadata Configuration

```bash
# Navigate to your Next.js project
cd your-nextjs-project

# Initialize the metadata configuration
npx next-seo-metadata
```

This will:

1. Create a `next-metadata.js` file in your project root
2. Prompt you for basic information about your site
3. Optionally update your layout file to use the new metadata configuration

### Update Your Metadata

Once initialized, you can simply edit the `next-metadata.js` file to update your metadata. The file is structured with:

- A `siteConfig` object containing all your variable data
- A `metadata` object that uses the values from `siteConfig`

### Structure of next-metadata.js

```javascript
// Site configuration (edit this part)
const siteConfig = {
  name: "Your Site Name",
  url: "https://yoursite.com",
  description: "Your site description",
  // ...more configuration
};

// Metadata object (uses siteConfig values)
const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  // ...more metadata
};

export default metadata;
export { siteConfig };
```

## Benefits

- **Single Source of Truth**: All your metadata in one place
- **DRY Principle**: Define values once, use them throughout your metadata
- **Better Organization**: Clear structure separating configuration from implementation
- **Easy Updates**: Change values in one place, updates everywhere

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
