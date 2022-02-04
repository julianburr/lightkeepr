import previewPng from "src/assets/preview.png";
import { tokens } from "src/theme/tokens";

const title = `Lightkeepr — Get the most value out of Lighthouse`;
const description =
  `Easily view and compare your lighthouse reports, ` +
  `detect regressions and get actionable suggestions.`;

const keywords = [
  "devtools",
  "developer tools",
  "lighthouse",
  "performance",
  "accessibility",
  "best practices",
  "SEO",
  "PWA",
  "compare",
  "reports",
];

export function SEO() {
  return (
    <>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="theme-color" content={tokens.color.brand["500"]} />

      {/* Open Graph */}
      <meta property="og:site_name" content="Lightkeepr" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content="https://www.lightkeepr.io" />
      <meta property="og:image" content={previewPng.src} />
      <meta property="og:image:width" content={previewPng.width.toString()} />
      <meta property="og:image:height" content={previewPng.height.toString()} />
      <meta property="og:locale" content="en" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content={`https://www.lightkeepr.io${previewPng.src}`}
      />
      <meta name="twitter:creator" content="@jburr90" />
    </>
  );
}
