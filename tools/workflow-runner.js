#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function printLine(text = "") {
  process.stdout.write(String(text) + "\n");
}

function exitWithError(message, code = 1) {
  printLine(`Error: ${message}`);
  process.exit(code);
}

function resolveRepoRoot() {
  return path.resolve(__dirname, "..", "");
}

function readTextFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (err) {
    exitWithError(`Failed to read file: ${filePath}`);
  }
}

function parseKeyedList(input, { allowNumbers = false, defaultValue = null } = {}) {
  if (!input || typeof input !== "string") {
    return {};
  }
  const result = {};
  for (const raw of input.split(",")) {
    const part = raw.trim();
    if (!part) continue;
    const [keyRaw, valRaw] = part.split(":").map((s) => (s || "").trim());
    const key = keyRaw;
    if (!key) continue;
    if (valRaw === undefined || valRaw === "") {
      result[key] = defaultValue;
      continue;
    }
    if (allowNumbers) {
      const num = Number(valRaw);
      result[key] = Number.isFinite(num) ? num : valRaw;
    } else {
      result[key] = valRaw;
    }
  }
  return result;
}

function parseScoredList(input) {
  if (!input || typeof input !== "string") {
    return {};
  }
  const result = {};
  for (const raw of input.split(",")) {
    const part = raw.trim();
    if (!part) continue;
    const [nameRaw, scoreRaw] = part.split(":").map((s) => (s || "").trim());
    const name = nameRaw;
    const scoreNum = Number(scoreRaw);
    if (!name) continue;
    result[name] = Number.isFinite(scoreNum) ? scoreNum : 1;
  }
  return result;
}

function deterministicRandom(seedString) {
  const hash = crypto.createHash("sha256").update(seedString).digest();
  const int = hash.readUInt32BE(0);
  return int / 0xffffffff;
}

function sampleValue(baseScore, seed, jitter = 0.2) {
  const r = deterministicRandom(seed);
  const factor = 1 - jitter + r * 2 * jitter;
  return baseScore * factor;
}

function prettyTable(rows, headers) {
  const allRows = headers ? [headers, ...rows] : rows;
  const widths = [];
  for (const row of allRows) {
    row.forEach((cell, idx) => {
      const len = String(cell).length;
      widths[idx] = Math.max(widths[idx] || 0, len);
    });
  }
  const renderRow = (row) =>
    row
      .map((cell, idx) => String(cell).padEnd(widths[idx], " "))
      .join("  ");
  return allRows.map(renderRow).join("\n");
}

function printHelp() {
  const usage = [
    "Usage:",
    "  tools/workflow-runner.js <workflow> [input] [--flag=value ...]",
    "",
    "Examples:",
    "  tools/workflow-runner.js code-review-game https://github.com/org/repo/pull/123",
    "  tools/workflow-runner.js feature-discovery \"Add real-time collaboration\"",
    "  tools/workflow-runner.js attention-auctions --items 'ui:0.8,api:0.6,db:0.9' --agents 'review:50,perf:40,security:30' --seed 42",
    "",
    "Workflows (docs-backed):",
    "  code-review-game, feature-discovery, ulysses-protocol, refactoring-game, wisdom-distillation, virgil-protocol,",
    "  swarm-intelligence, mcp-orchestrate, pattern-synthesizer, meta-learning-dgm",
    "",
    "Workflows (locally runnable):",
    "  attention-auctions",
  ].join("\n");
  printLine(usage);
}

function getWorkflowPath(workflowName) {
  const root = resolveRepoRoot();
  const mapping = {
    "code-review-game": path.join(root, ".claude/commands/meta-frameworks/code-review-game.md"),
    "feature-discovery": path.join(root, ".claude/commands/meta-frameworks/feature-discovery.md"),
    "ulysses-protocol": path.join(root, ".claude/commands/meta-frameworks/ulysses-protocol.md"),
    "refactoring-game": path.join(root, ".claude/commands/meta-frameworks/refactoring-game.md"),
    "wisdom-distillation": path.join(root, ".claude/commands/meta-frameworks/wisdom-distillation.md"),
    "virgil-protocol": path.join(root, ".claude/commands/meta-frameworks/virgil-protocol.md"),
    "swarm-intelligence": path.join(root, ".claude/commands/orchestration/swarm-intelligence.md"),
    "mcp-orchestrate": path.join(root, ".claude/commands/orchestration/mcp-orchestrate.md"),
    "pattern-synthesizer": path.join(root, ".claude/commands/synthesis/pattern-synthesizer.md"),
    "meta-learning-dgm": path.join(root, ".claude/commands/synthesis/meta-learning-dgm.md"),
    "attention-auctions": path.join(root, ".claude/commands/orchestration/attention-auctions.md"),
  };
  return mapping[workflowName] || null;
}

function runDocsWorkflow(workflowName) {
  const p = getWorkflowPath(workflowName);
  if (!p) {
    exitWithError(`Unknown workflow: ${workflowName}`);
  }
  const content = readTextFile(p);
  const header = `\n=== ${workflowName} ===\n`;
  printLine(header);
  const preview = content.split("\n").slice(0, 60).join("\n");
  printLine(preview);
  if (content.split("\n").length > 60) {
    printLine("\n[...truncated. Open the file for full instructions: " + p + "]\n");
  }
}

function runAttentionAuctions(args) {
  const itemsArg = getFlag(args, "--items");
  const agentsArg = getFlag(args, "--agents");
  const seedArg = getFlag(args, "--seed");

  const itemToScore = parseScoredList(itemsArg);
  const agentToBudget = parseKeyedList(agentsArg, { allowNumbers: true, defaultValue: null });

  const itemNames = Object.keys(itemToScore);
  if (itemNames.length === 0) {
    exitWithError("No items provided. Use --items 'name:score,...'");
  }

  const agentNames = Object.keys(agentToBudget);
  if (agentNames.length === 0) {
    exitWithError("No agents provided. Use --agents 'name:budget,...' or at least 'name1,name2' with colons omitted");
  }

  const defaultBudget = 100;
  for (const agentName of agentNames) {
    if (agentToBudget[agentName] === null) {
      agentToBudget[agentName] = Math.floor(defaultBudget / agentNames.length);
    }
  }

  const remainingBudget = { ...agentToBudget };
  const allocations = [];

  for (const itemName of itemNames) {
    const baseScore = itemToScore[itemName] || 1;
    const bids = [];
    for (const agentName of agentNames) {
      const seed = `${seedArg || "0"}:${agentName}:${itemName}`;
      const value = sampleValue(baseScore, seed, 0.2);
      bids.push({ agentName, value });
    }
    bids.sort((a, b) => b.value - a.value);

    const highest = bids[0];
    const second = bids[1] || { value: 0 };
    const price = Math.max(0, second.value);

    if (remainingBudget[highest.agentName] >= price) {
      remainingBudget[highest.agentName] -= price;
      allocations.push({ itemName, winner: highest.agentName, price: price.toFixed(2), value: highest.value.toFixed(2) });
    } else {
      allocations.push({ itemName, winner: "unallocated", price: "0.00", value: highest.value.toFixed(2) });
    }
  }

  const rows = allocations.map((a) => [a.itemName, a.winner, a.price, a.value]);
  const headers = ["Item", "Winner", "Price(second)", "WinnerValue"];

  printLine("\nAttention Auctions — Second-Price Allocation\n");
  printLine(prettyTable(rows, headers));
  printLine("\nRemaining Budgets:\n");
  const budgetRows = Object.entries(remainingBudget).map(([name, amt]) => [name, String(amt)]);
  printLine(prettyTable(budgetRows, ["Agent", "RemainingBudget"]));
  printLine("\nNotes: Bids are derived from item scores with deterministic jitter. Price is the second-highest bid.");
}

function getFlag(args, name) {
  for (const arg of args) {
    if (arg.startsWith(name + "=")) return arg.slice(name.length + 1);
  }
  return null;
}

function main(argv) {
  const [, , workflowName, maybeInput, ...rest] = argv;
  if (!workflowName || workflowName === "-h" || workflowName === "--help") {
    printHelp();
    process.exit(0);
  }

  if (workflowName === "attention-auctions") {
    const flagArgs = (maybeInput && String(maybeInput).startsWith("--")) ? [maybeInput, ...rest] : rest;
    runAttentionAuctions(flagArgs);
    return;
  }

  runDocsWorkflow(workflowName, maybeInput, rest);
}

if (require.main === module) {
  main(process.argv);
}