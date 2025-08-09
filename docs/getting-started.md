# Getting Started

This project curates AI-assisted, game-theoretic workflows for software development.

Prerequisites:
- Node.js 18+
- Git

Quick start:
- Explore workflows via the CLI:
  - `./tools/workflow-runner.js --help`
  - `bash examples/code-review-game/run.sh`
  - `bash examples/feature-discovery/run.sh`
  - `bash examples/attention-auctions/run.sh`
  - `bash examples/run-all.sh`

Notes:
- Most workflows are documentation-backed and meant to be run with your preferred AI tool. The CLI surfaces instructions. See `examples/` for runnable demonstrations for each workflow.
- The "Attention Auctions" workflow includes a local simulator for allocating reviewer/agent attention using a second-price auction.