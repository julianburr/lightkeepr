const pkg = require("../../package.json");

function getEnv(argv) {
  return {
    LIGHTKEEPR: true,
    LIGHTKEEPR_VERSION: pkg.version,
    LIGHTKEEPR_API_URL: argv.apiUrl,
    LIGHTKEEPR_TOKEN: argv.token,
    LIGHTKEEPR_BUILD_ID: argv.buildId,
    ...process.env,
  };
}

module.exports = { getEnv };
