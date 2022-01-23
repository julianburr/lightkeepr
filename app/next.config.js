// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const { withSentryConfig } = require("@sentry/nextjs");

const config = {
  reactStrictMode: true,

  generateEtags: false,

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

      // Add MJML loader to import email templates as HTML
      {
        test: /\.mjml$/,
        use: [
          {
            loader: "webpack-mjml-loader",
            options: {
              minify: true,
            },
          },
        ],
      },
    ]);
    return config;
  },
};

module.exports = process.env.SENTRY_URL
  ? withSentryConfig(config, { silent: true })
  : config;
