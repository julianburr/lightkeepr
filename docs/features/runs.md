---
title: Runs
category: Features
---

## What are runs?

Runs are essentially a bundle of [reports](./reports) that have been sent together. Usually this will be e.g. based on a specific commit.

Runs will be used to keep track of and compare your reports over time and across different branches (e.g. comparing a feature branch to your base branch).

## Run status

The status of a run is determined based on the report statuses of the reports it contains. This means, a run is marked (and shown) as "failed" if any of its reports is marked as "failed". To change the run status to "passed", all failed reports need to be marked as "passed".
