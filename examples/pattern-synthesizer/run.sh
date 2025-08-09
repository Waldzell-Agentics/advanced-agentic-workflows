#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
node tools/workflow-runner.js pattern-synthesizer "Extract patterns from 10 successful onboarding flows and synthesize meta-patterns" | cat