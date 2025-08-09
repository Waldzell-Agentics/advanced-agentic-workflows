#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
node tools/workflow-runner.js refactoring-game "Refactor authentication module to remove circular dependencies and improve testability" | cat