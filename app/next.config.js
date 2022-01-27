const { withSentryConfig } = require("@sentry/nextjs");

const config = {
  reactStrictMode: true,

  // Fixes issue with Sentry in production
  // https://github.com/vercel/next.js/issues/30601#issuecomment-961323914
  outputFileTracing: false,

  webpack: (config) => {
    config.module.rules = config.module.rules.concat([
      // Add SVGR loader to import SVGs as react components
      {
        test: /\.svg$/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              svgoConfig: {
                plugins: [
                  {
                    name: "removeViewBox",
                    active: false,
                  },
                ],
              },
            },
          },
        ],
      },
    ]);
    return config;
  },
};

// Add Sentry setup if env variable is set
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
module.exports = process.env.SENTRY_URL
  ? withSentryConfig(config, { silent: true })
  : config;
