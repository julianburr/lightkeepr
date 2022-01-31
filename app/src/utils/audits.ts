/**
 * This list is used to determine which audits to store in firestore (additional to the stored
 * report JSON) for easier access, e.g. used on the report summary page
 */

export const CATEGORIES = [
  {
    id: "performance",
    label: "Performance",
  },
  {
    id: "accessibility",
    label: "Accessibility",
  },
  {
    id: "best-practices",
    label: "Best practices",
  },
  {
    id: "seo",
    label: "SEO",
  },
  {
    id: "pwa",
    label: "PWA",
  },
];

export const AUDITS = [
  // Performance
  {
    id: "first-contentful-paint",
    label: "First contentful paint",
    category: "performance",
    default: true,
  },
  {
    id: "largest-contentful-paint",
    label: "Largest contentful paint",
    category: "performance",
    default: true,
  },
  {
    id: "max-potential-fid",
    label: "First input delay",
    category: "performance",
    default: true,
  },
  {
    id: "total-blocking-time",
    label: "Total blocking time",
    category: "performance",
    default: true,
  },
  {
    id: "cumulative-layout-shift",
    label: "Cumulative layout shift",
    category: "performance",
    default: true,
  },
  {
    id: "interactive",
    label: "Time to interactive",
    category: "performance",
    default: false,
  },
  {
    id: "speed-index",
    label: "Speed index",
    category: "performance",
    default: false,
  },
  {
    id: "bootup-time",
    label: "Javascript execution time",
    category: "performance",
    default: false,
  },

  // Network
  {
    id: "unused-javascript",
    label: "Unused Javascript",
    category: "network",
    default: true,
  },
  {
    id: "unused-css-rules",
    label: "Unused CSS rules",
    category: "network",
    default: true,
  },
  {
    id: "unminified-javascript",
    label: "Unminified Javascript",
    category: "network",
    default: true,
  },
  {
    id: "network-requests",
    label: "Network requests",
    category: "network",
    default: true,
  },
  {
    id: "server-response-time",
    label: "Server response time",
    category: "network",
    default: true,
  },
  {
    id: "critical-request-chains",
    label: "Critical request chains",
    category: "network",
    default: false,
  },

  // Others
  {
    id: "user-timings",
    label: "User Timing marks and measures",
    category: "others",
    default: false,
  },
  {
    id: "diagnostics",
    label: "Diagnostics",
    category: "others",
    default: false,
  },
  {
    id: "metrics",
    label: "Metrics",
    category: "others",
    default: false,
  },
  {
    id: "performance-budget",
    label: "Performance budget",
    category: "others",
    default: false,
  },
  {
    id: "timing-budget",
    label: "Timing budget",
    category: "others",
    default: false,
  },
  {
    id: "resource-summary",
    label: "Resource summary",
    category: "others",
    default: false,
  },
];
