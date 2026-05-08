#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

type Options = {
  help?: boolean;
  install: boolean;
  packageName?: string;
  siteUrl?: string;
  codeowner?: string;
};

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  const packageName = normalizePackageName(
    options.packageName ?? inferPackageName(),
  );
  const siteUrl = options.siteUrl ?? "https://www.example.com";

  updatePackageFiles(packageName);
  updateEnvFiles(siteUrl);

  if (options.codeowner) {
    updateCodeowners(options.codeowner);
  }

  if (options.install) {
    run("npm", ["install"]);
  }

  console.log(`\n[bootstrap] Repo bootstrapped: ${packageName}
[bootstrap] Site URL: ${siteUrl}

Next steps:
  1. Edit src/config/site.ts with business details.
  2. Replace sample content in src/content/.
  3. Add images to public/images/.
  4. Run npm run build && npm run preview.
`);
}

function parseArgs(args: string[]): Options {
  const options: Options = { install: false };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg === "--install") {
      options.install = true;
      continue;
    }

    if (arg.startsWith("--")) {
      const [flag, inlineValue] = arg.split("=", 2);
      const value = inlineValue ?? args[++i];
      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for ${flag}`);
      }
      setOption(options, flag, value);
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function setOption(options: Options, flag: string, value: string) {
  switch (flag) {
    case "--package-name":
    case "--repo-name":
      options.packageName = value;
      break;
    case "--site-url":
      options.siteUrl = value;
      break;
    case "--codeowner":
      options.codeowner = value;
      break;
    default:
      throw new Error(`Unknown flag: ${flag}`);
  }
}

function printHelp() {
  console.log(`Bootstrap a duplicated repo.

Usage:
  npm run bootstrap:site -- --package-name acme-construction --site-url https://acme.example

Options:
  --package-name  npm package name (defaults from git remote or folder name)
  --repo-name     Alias for --package-name
  --site-url      Production URL for canonical links and sitemap
  --codeowner     GitHub username for CODEOWNERS
  --install       Run npm install after updates
  --help, -h      Show this message
`);
}

function inferPackageName(): string {
  try {
    const url = execFileSync("git", ["remote", "get-url", "origin"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    const m = url.match(/[:/]([^/:]+?)(?:\.git)?$/);
    if (m) return m[1];
  } catch {
    // git remote not available
  }
  return path.basename(process.cwd());
}

function normalizePackageName(v: string): string {
  const n = v
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!n) throw new Error(`Invalid package name: "${v}"`);
  return n;
}

function updatePackageFiles(name: string) {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  pkg.name = name;
  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");

  const lock = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
  lock.name = name;
  if (lock.packages?.[""]) lock.packages[""].name = name;
  fs.writeFileSync("package-lock.json", JSON.stringify(lock, null, 2) + "\n");
}

function updateEnvFiles(siteUrl: string) {
  replaceInFile(".env.example", /^SITE_URL=.*$/m, `SITE_URL=${siteUrl}`);
  if (!fs.existsSync(".env")) {
    fs.writeFileSync(".env", fs.readFileSync(".env.example", "utf8"));
  }
}

function updateCodeowners(owner: string) {
  const u = owner.startsWith("@") ? owner : `@${owner}`;
  replaceAllInFile(".github/CODEOWNERS", /@[\w-]+/g, u);
}

function replaceInFile(file: string, pattern: RegExp, replacement: string) {
  const c = fs.readFileSync(file, "utf8");
  fs.writeFileSync(file, c.replace(pattern, replacement));
}

function replaceAllInFile(file: string, pattern: RegExp, replacement: string) {
  const c = fs.readFileSync(file, "utf8");
  fs.writeFileSync(file, c.replaceAll(pattern, replacement));
}

function run(cmd: string, args: string[]) {
  execFileSync(cmd, args, { stdio: "inherit" });
}

main();
