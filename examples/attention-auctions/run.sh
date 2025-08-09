#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
node tools/workflow-runner.js attention-auctions --items 'ui:0.8,api:0.6,db:0.9,docs:0.4' --agents 'review:50,perf:40,security:30' --seed 42 | cat