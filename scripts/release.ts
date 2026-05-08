#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

type ReleaseOptions = {
  dryRun: boolean;
};

function main(): void {
  const options = parseArguments(process.argv.slice(2));

  assertOnMainBranch();
  assertCleanWorkingTree();
  ensureCommand("tar");

  run("npm", ["run", "format:check"]);
  run("npm", ["run", "lint"]);
  run("npm", ["run", "build"]);
  packageStaticBuild();

  const semanticReleaseArgs = ["semantic-release", "--no-ci"];

  if (options.dryRun) {
    semanticReleaseArgs.push("--dry-run");
  }

  run("npx", semanticReleaseArgs);
}

function parseArguments(args: string[]): ReleaseOptions {
  const options: ReleaseOptions = {
    dryRun: false,
  };

  for (const argument of args) {
    if (argument === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (argument === "--help" || argument === "-h") {
      printHelp();
      process.exit(0);
    }

    throw new Error(`Unknown release argument: ${argument}`);
  }

  return options;
}

function printHelp(): void {
  process.stdout.write(`Create a semantic-release from main.

Usage:
  npm run release
  npm run release:dry

What it does:
  1. Confirms the current branch is main.
  2. Confirms the working tree is clean.
  3. Runs format, lint, and production build checks.
  4. Archives dist/ to release-artifacts/dist.tar.gz.
  5. Runs semantic-release, which updates CHANGELOG.md, creates a tag,
     creates a GitHub Release, and attaches the built static files.
`);
}

function getCurrentBranch(): string {
  return execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
    encoding: "utf8",
  }).trim();
}

function assertOnMainBranch(): void {
  const branch = getCurrentBranch();

  if (branch !== "main") {
    throw new Error(
      `Releases must be run from the main branch. Currently on: ${branch}`,
    );
  }
}

function assertCleanWorkingTree(): void {
  const status = execFileSync("git", ["status", "--porcelain"], {
    encoding: "utf8",
  }).trim();

  if (status.length > 0) {
    throw new Error(
      "Releases require a clean working tree. Commit or stash local changes first.",
    );
  }
}

function ensureCommand(command: string): void {
  try {
    execFileSync("bash", ["-lc", `command -v ${command}`], {
      stdio: "ignore",
    });
  } catch {
    throw new Error(`Required command not found: ${command}`);
  }
}

function packageStaticBuild(): void {
  const distDirectory = path.resolve("dist");
  const artifactDirectory = path.resolve("release-artifacts");
  const artifactPath = path.join(artifactDirectory, "dist.tar.gz");

  if (!fs.existsSync(distDirectory)) {
    throw new Error("dist/ does not exist. The build must complete first.");
  }

  fs.rmSync(artifactDirectory, { force: true, recursive: true });
  fs.mkdirSync(artifactDirectory, { recursive: true });

  run("tar", ["-czf", artifactPath, "-C", distDirectory, "."]);
}

function run(command: string, args: string[]): void {
  execFileSync(command, args, {
    stdio: "inherit",
  });
}

main();
