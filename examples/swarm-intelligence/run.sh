#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
node tools/workflow-runner.js swarm-intelligence "Design a privacy-preserving product analytics module with event schemas and dashboards" | cat