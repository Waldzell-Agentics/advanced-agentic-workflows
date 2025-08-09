# Baseline

- Node: v22.16.0
- pnpm: 10.11.1

## Runner help


Usage:
  tools/workflow-runner.js <workflow> [input] [--flag=value ...]

Examples:
  tools/workflow-runner.js code-review-game https://github.com/org/repo/pull/123
  tools/workflow-runner.js feature-discovery "Add real-time collaboration"
  tools/workflow-runner.js attention-auctions --items 'ui:0.8,api:0.6,db:0.9' --agents 'review:50,perf:40,security:30' --seed 42

Workflows (docs-backed):
  code-review-game, feature-discovery, ulysses-protocol, refactoring-game, wisdom-distillation, virgil-protocol,
  swarm-intelligence, mcp-orchestrate, pattern-synthesizer, meta-learning-dgm

Workflows (locally runnable):
  attention-auctions
