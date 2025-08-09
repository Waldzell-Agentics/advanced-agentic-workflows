#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
node tools/workflow-runner.js virgil-protocol "Introduce GraphQL while preserving REST familiarity and minimizing churn" | cat