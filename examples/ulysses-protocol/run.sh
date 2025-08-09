#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
node tools/workflow-runner.js ulysses-protocol "Fix critical MCP integration causing workflow failures in production" | cat