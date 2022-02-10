# `@lightkeepr/cli`

## Getting started

### Get the project API token

To get started, you need to get an API token from Lightkeepr. To do so:

- [log into](https://www.lightkeepr.io/auth/sign-in) your Lightkeepr account (or [create a new account](https://www.lightkeepr.io/auth/sign-up) if you don't have one yet)
- go to the project you want to send reports to
- in "project settings" you will find the project specific API token, that you can use to send reports to the project 🚀

### Record a run and add reports to it

```bash
# Set API token
export LIGHTKEEPR_TOKEN={{ YOUR TOKEN }}

# Start run and store returned ID in env
export LIGHTKEEPR_RUN_ID=$(npx lightkeepr start)

# Run lighthouse reports
npx lightkeepr report --url=https://www.julianburr.de/til
npx lightkeepr report --url=https://www.julianburr.de/around-the-world

# Finish run
npx lightkeepr stop
```

## Commands & options

```bash
# Run this to get an overview of available commands in your terminal
npx lightkeepr --help
```

### lightkeepr start

Starts a run in the project specified by the API token.

- `--branch={{ BRANCH NAME }}` — Specify the branch name this run is recorded from. This allows Lightkeepr to compare reports to previous runs on the same branch, as well as to the latest run of your base branch.
- `--commit={{ COMMIT HASH }}` — Specify the commit hash associated with this run. This way Lightkeepr can link straight to a commit when it detects regressions etc.
- `--commit-message={{ MESSAGE }}` — Allows to specify a human readable message. This will make it easier in the Lightkeepr to distinguish the runs.
- `--token={{ TOKEN }}` — Allows you to specifiy an API token. It is generally recommended to set the token via the `LIGHTKEEPR_TOKEN` environment variable instead, so you don't have to set it in every command.
- `--api-url={{ URL }}` — Allows you to define a custom API url (e.g. if you're running a local API server to add middleware behaviour), defaults to the Lightkeepr API url (https://www.lightkeepr.io/api).

### lightkeepr report

Sends a report to the specified run.

- `--url={{ URL }}` — Specify the URL you want to create a lighthouse report for and send it to Lightkeepr
- `--run-id={{ RUN ID }}` — The ID of the run you want the report to be associated with. It is recommended to use the `LIGHTKEEPR_RUN_ID` environment variable instead
- `--token={{ TOKEN }}` — See above.
- `--api-url={{ URL }}` — See above.

### lightkeepr stop

Stops the specified run.

- `--run-id={{ RUN ID }}` — See above.
- `--token={{ TOKEN }}` — See above.
- `--api-url={{ URL }}` — See above.

### lightkeepr exec

Allows you to run another command wrapped in a Lightkeepr run. This can be used e.g. to use Lightkeepr with Cypress.

```bash
npx lightkeepr exec -- cypress run
```

Learn more [here](https://www.lightkeepr.io/docs/packages/cypress).

## Environment variables

- `LIGHTKEEPR_TOKEN` — Project specific API token.
- `LIGHTKEEPR_RUN_ID` — Lightkeepr run ID any reports should be sent to.

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
