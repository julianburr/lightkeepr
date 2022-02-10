# `@lightkeepr/node`

## Getting started

### Install

```bash
yarn add @lightkeepr/node

# or
npm i @lightkeepr/node
```

### Basic example for sending reports

```js
const lightkeepr = require("@lightkeepr/node");

// Start a run
const run = await lightkeepr.startRun();

// Send reports to that run
await run.report({ url: "https://www.julianburr.de/til" });
await run.report({ url: "https://www.julianburr.de/around-the-world" });

// Stop the run
await run.stopRun();
```

Then simply run your script with the API token specified.

```bash
LIGHTKEEPR_TOKEN={{ YOUR TOKEN }} node ./script.js
```

See the documentation for the [cli package](https://www.lightkeepr.io/docs/packages/cli) for more information on the available environment variables and CLI options.

## Methods & arguments

### startRun

Creates a run instace in the project related to the API token specified.

- `branch` — Specify the branch name this run is recorded from. This allows Lightkeepr to compare reports to previous runs on the same branch, as well as to the latest run of your base branch.
- `commit` — Specify the commit hash associated with this run. This way Lightkeepr can link straight to a commit when it detects regressions etc.
- `commitMessage` — Allows to specify a human readable message. This will make it easier in the Lightkeepr to distinguish the runs.
- `token` — Specifies the API token that defines which project the run will be associated with. It is generally recommended to use the `LIGHTKEEPR_TOKEN` environment variable for this.
- `apiUrl` — Allows you to define a custom API url (e.g. if you're running a local API server to add middleware behaviour), defaults to the Lightkeepr API url (https://www.lightkeepr.io/api).

### report

Creates a Lighthouse report for the given url and sends it to Lightkeepr as part of the current run.

- `url` — Specify the URL you want to create a lighthouse report for and send it to Lightkeepr
- `runId` — The ID of the run you want the report to be associated with. This will be pre-defined appropriately if you use the run instance returned by `startRun`.
- `token` — See above.
- `apiUrl` — See above.

### stopRun

Stops the current run.

- `runId` — See above.
- `token` — See above.
- `apiUrl` — See above.

## Development

Want to contribute to this package? Awesome! Simply clone this repo and use the below commands to get started.

```bash
# Install all dependencies (run in the root folder)
yarn

# Change into packages folder
cd packages

# Run build
yarn build

# Build and watch files for any changes
yarn start
```
