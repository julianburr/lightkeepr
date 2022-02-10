---
title: Projects
category: Features
---

## What are projects?

Projects allow you to easily group reports, to make it easier to see all relevant reports for a specific site, app or app section in one place. A team can have as many projects as you want, however projects cannot be shared between multiple teams.

## Create a new project

To create a new project, simply go to the team overview page and click "Add new project". You will have to enter some project details, such as a project name and the main git branch, which Lightkeepr will use e.g. to compare reports from feature branches to their base.

Once the project has been created, it's good to go. You can [start sending reports](./reports) to it using the unique project API token.

You can always find that token on the projects settings page. There you can also edit details like the project name or main git branch at any time.

## Fail on regression

In the projects settings, you can also activate "Fail on regression". When active, Lightkeepr will check for any regressions on the primary Lighthouse scores (performance, accessibility, best practises, SEO & PWA). If there are any regressions, the report (and the run) will be marked as "failed". This can be useful if you [use Lightkeepr as a check in your PR process](../use-cases/check-for-pull-requests-using-github-actions).

## Project targets

In a very similar way, project targets can be set in the project settings and used to make sure that your reports react a minimum score in any of the primary scores. Again, if active, Lightkeepr will use these targets to check against on each incoming report. If a report has scores below their targets, that report will be marked as "failed".

## Manual approval process

Whenever a report is marked as "failed", it will be highlighted as such in the reports list and on the details page, where you can also find a more detailed description of the reason(s) why the report has failed.

To deal with failed reports, Lightkeepr provides a manual review and approval flow. Any team member can check any of the failed reports and, if they think it should not be marked as "failed", mark it as "manually approved" (e.g. because they think the results are inacurate or a regression has been expected based on the changed made).

Once manually approved, Lightkeepr will show the reports as "passed", with an inidicator that shows that it has been manually approved. It will also show who approved it and when on the details page.
