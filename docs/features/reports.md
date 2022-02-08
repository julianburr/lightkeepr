---
title: Reports
category: Features
---

## What are reports?

Reports are instances of Lighthouse reports that you have sent to Lightkeepr (e.g. using one of the helper libraries).

Lightkeepr stores the whole Lighthouse report as JSON, which beyond the primary scores contains a lot of other checks and suggestions which can be useful to improve your application. Lightkeepr tries to make those improvement opportunities more accessibile through its inituitive UI, including an "overview" section on the report details page.

## Report status

Reports can have one of two statuses: "passed" or "failed". Reports are marked as failed if one of the following is true:

- ["Fail on regression"](./projects#fail-on-regression) is active in the project settings and the reports has one or more regressions in the primary scores compared to either the previous commit on the same branch or, if the report is associated with a feature branch, compared to the main branch
- the project has [active "targets"](./projects#project-targets) and one or more of the primary scores is below its target
- the report has [performance budgets](https://web.dev/use-lighthouse-for-performance-budgets/) set and one or more of them are not met

Any report marked as "failed" can be [manually approved](./projects#manual-approval-process) within the Lightkeepr UI to change its status to "passed".
