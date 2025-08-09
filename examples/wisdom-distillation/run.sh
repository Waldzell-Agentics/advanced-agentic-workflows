#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
node tools/workflow-runner.js wisdom-distillation "Distill lessons learned from our monolith-to-microservices migration" | cat