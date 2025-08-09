# Getting Started

This project curates AI-assisted, game-theoretic workflows for software development.

Prerequisites:
- Node.js 18+
- Git

Quick start:
- Explore workflows via the CLI:
  - `./tools/workflow-runner.js --help`
  - `./tools/workflow-runner.js code-review-game`
  - `./tools/workflow-runner.js feature-discovery "Discover realtime collab"`
  - `./tools/workflow-runner.js attention-auctions --items 'ui:0.8,api:0.6' --agents 'review:50,perf:40'`

Notes:
- Most workflows are documentation-backed and meant to be run with your preferred AI tool. The CLI surfaces instructions.
- The "Attention Auctions" workflow includes a local simulator for allocating reviewer/agent attention using a second-price auction.