import pkg from "../../package.json";

type EnhancedEnv = { [key: string]: any };

export function getEnv(argv): EnhancedEnv {
  return {
    LIGHTKEEPR: true,
    LIGHTKEEPR_VERSION: pkg.version,
    LIGHTKEEPR_API_URL: argv.apiUrl,
    LIGHTKEEPR_TOKEN: argv.token,
    LIGHTKEEPR_BUILD_ID: argv.buildId,
    ...process.env,
  };
}
