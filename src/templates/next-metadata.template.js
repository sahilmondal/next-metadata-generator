/**
 * Next.js SEO Metadata Configuration
 *
 * This file contains all the metadata for your Next.js application.
 * Edit the siteConfig object to update your site information.
 */

/**
 * Site Configuration
 * Modify this object to update your site details
 */
const siteConfig = {
  // Basic info
  name: "{{siteName}}",
  url: "{{siteUrl}}",
  description: "{{siteDescription}}",

  // Social media and contact
  twitter: {
    handle: "@yourtwitterhandle",
    site: "@yoursite",
    cardType: "summary_large_image",
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "{{siteName}}",
  },

  // Icons
  icons: {
    icon: "/favicon.ico",
    apple: [{ url: "/apple-icon.png" }],
  },

  // Default image for social sharing
  defaultImage: "/images/og-default.jpg",

  // Keywords for SEO
  keywords: [
    "Next.js",
    "React",
    "JavaScript",
    // Add more keywords related to your site
  ],

  // Creator/author info
  creator: "Your Name",
  publisher: "{{siteName}}",

  // Other
  themeColor: "#ffffff",
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Metadata Configuration
 * The metadata object is structured according to Next.js metadata API
 * https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
const metadata = {
  // Basic metadata
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,

  // Open Graph
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.openGraph.siteName,
    locale: siteConfig.openGraph.locale,
    type: siteConfig.openGraph.type,
    images: [
      {
        url: `${siteConfig.url}${siteConfig.defaultImage}`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },

  // Twitter
  twitter: {
    card: siteConfig.twitter.cardType,
    title: siteConfig.name,
    description: siteConfig.description,
    site: siteConfig.twitter.site,
    creator: siteConfig.twitter.handle,
    images: [`${siteConfig.url}${siteConfig.defaultImage}`],
  },

  // Icons
  icons: siteConfig.icons,

  // Other metadata
  robots: siteConfig.robots,
  themeColor: siteConfig.themeColor,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,

  // Verification tokens (uncomment and add your verification tokens)
  // verification: {
  //   google: "your-google-verification-token",
  //   yandex: "your-yandex-verification-token",
  //   yahoo: "your-yahoo-verification-token",
  // },

  // Canonical URL
  alternates: {
    canonical: siteConfig.url,
  },

  // Viewport
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

// Export the metadata object as default
export default metadata;

// Export siteConfig for use in other files
export { siteConfig };
