# Attention Auctions

Overview:
- Allocate scarce reviewer/agent attention to the highest-impact work using a second-price auction.

Inputs:
- Items with impact scores, e.g., `ui:0.8,api:0.6,db:0.9`
- Agents with attention budgets, e.g., `review:50,perf:40,security:30`

Protocol:
1. For each item, agents submit sealed bids based on perceived impact.
2. Highest bidder wins; pays the second-highest price (Vickrey auction).
3. Deduct price from winner's remaining budget.
4. Continue until items allocated or budgets exhausted.

CLI (local simulator):
- `./tools/workflow-runner.js attention-auctions --items 'ui:0.8,api:0.6,db:0.9' --agents 'review:50,perf:40,security:30' --seed 42`

Notes:
- Use as a planning step before review or triage. Calibrate budgets to sprint capacity.
- Combine with Code Review Game to enforce concern budgets during execution.