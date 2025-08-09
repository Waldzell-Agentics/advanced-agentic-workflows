#!/usr/bin/env bash
set -euo pipefail
HERE="$(dirname "$0")"

bash "$HERE/code-review-game/run.sh"
echo
bash "$HERE/feature-discovery/run.sh"
echo
bash "$HERE/refactoring-game/run.sh"
echo
bash "$HERE/ulysses-protocol/run.sh"
echo
bash "$HERE/wisdom-distillation/run.sh"
echo
bash "$HERE/virgil-protocol/run.sh"
echo
bash "$HERE/swarm-intelligence/run.sh"
echo
bash "$HERE/mcp-orchestrate/run.sh"
echo
bash "$HERE/pattern-synthesizer/run.sh"
echo
bash "$HERE/meta-learning-dgm/run.sh"
echo
bash "$HERE/attention-auctions/run.sh"