#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
node tools/workflow-runner.js code-review-game "https://github.com/org/repo/pull/123" | cat