#!/usr/bin/env node
/**
 * beforeShellExecution: ask before force-push / hard reset / clean -fd / branch -D.
 */
function readStdin() {
  try {
    return require("fs").readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

let input = {};
try {
  input = JSON.parse(readStdin() || "{}");
} catch {
  input = {};
}

const command = String(input.command || "");
const risky =
  /\bgit\s+push\b[\s\S]*--force\b/i.test(command) ||
  /\bgit\s+push\b[\s\S]*\s-f\b/i.test(command) ||
  /\bgit\s+reset\s+--hard\b/i.test(command) ||
  /\bgit\s+clean\s+-fd\b/i.test(command) ||
  /\bgit\s+branch\s+-D\b/i.test(command);

if (!risky) {
  process.stdout.write(JSON.stringify({ permission: "allow" }));
  process.exit(0);
}

process.stdout.write(
  JSON.stringify({
    permission: "ask",
    user_message:
      "Destructive git command detected. Confirm before the agent continues.",
    agent_message:
      "A Formello hook flagged a destructive git command (force push, hard reset, clean -fd, or branch -D). Wait for user approval.",
  })
);
process.exit(0);
