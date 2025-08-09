#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
node tools/workflow-runner.js feature-discovery "Add real-time collaboration to the editor with presence and cursor sharing" | cat