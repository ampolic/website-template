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
  contactAction?: string;
};

type PackageJson = {
  name?: string;
  packages?: Record<string, { name?: string }>;
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
  const codeowner = options.codeowner ?? inferCodeowner();

  updatePackageFiles(packageName);
  updateEnvFiles(siteUrl);

  if (codeowner) {
    updateCodeowners(codeowner);
  }

  if (options.contactAction) {
    updateContactAction(options.contactAction);
  }

  if (options.install) {
    run("npm", ["install"]);
  }

  process.stdout.write(`\n[bootstrap] Repo bootstrapped: ${packageName}
[bootstrap] Site URL: ${siteUrl}
${codeowner ? `[bootstrap] Codeowner: ${codeowner}\n` : ""}
Next steps:
  1. Edit src/config/site.ts with your business details.
  2. Replace sample content in src/content/.
  3. Add images to src/assets/images/ and public/images/.
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
      const equalsIndex = arg.indexOf("=");
      const flag = equalsIndex >= 0 ? arg.slice(0, equalsIndex) : arg;
      const inlineValue =
        equalsIndex >= 0 ? arg.slice(equalsIndex + 1) : undefined;
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
    case "--repo-name": {
      options.packageName = value;
      break;
    }
    case "--site-url": {
      options.siteUrl = value;
      break;
    }
    case "--codeowner": {
      options.codeowner = value;
      break;
    }
    case "--contact-action": {
      options.contactAction = value;
      break;
    }
    default: {
      throw new Error(`Unknown flag: ${flag}`);
    }
  }
}

function printHelp() {
  process.stdout.write(`Bootstrap a duplicated repo for a new site.

Usage:
  npm run bootstrap:site -- [options]

Options:
  --package-name    npm package name (default: inferred from git remote or folder name)
  --repo-name       Alias for --package-name
  --site-url        Production URL for canonical links and sitemap
                    (default: https://www.example.com)
  --codeowner       GitHub user or org/team for CODEOWNERS
                    (default: inferred from git remote; supports @user or @org/team)
  --contact-action  URL for the contact form POST endpoint
                    (default: leave as-is; set in src/config/site.ts later)
  --install         Run npm install after updates
  --help, -h        Show this message

Examples:
  # Minimal — infers package name and codeowner from git remote
  npm run bootstrap:site -- --site-url https://acme.example

  # Fully explicit for an org repo
  npm run bootstrap:site -- \\
    --package-name acme-construction \\
    --site-url https://acme.example \\
    --codeowner @acme-org/web-team \\
    --contact-action https://forms.acme.example/contact \\
    --install
`);
}

function inferPackageName(): string {
  try {
    const url = execFileSync("git", ["remote", "get-url", "origin"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    const m = url.match(/[:/](?:[^/:]+\/)?([^/:]+?)(?:\.git)?$/);
    if (m) {
      return m[1];
    }
  } catch {
    // git remote not available
  }
  return path.basename(process.cwd());
}

function inferCodeowner(): string | undefined {
  try {
    const url = execFileSync("git", ["remote", "get-url", "origin"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();

    // Matches both SSH (git@github.com:owner/repo.git) and HTTPS (https://github.com/owner/repo.git)
    const m = url.match(/github\.com[/:]([^/:]+)\/[^/:]+?(?:\.git)?$/);
    if (m) {
      return `@${m[1]}`;
    }
  } catch {
    // git remote not available
  }
  return undefined;
}

function normalizePackageName(v: string): string {
  const n = v
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9-_]+/g, "-")
    .replaceAll(/-{2,}/g, "-")
    .replaceAll(/^-+|-+$/g, "");
  if (!n) {
    throw new Error(`Invalid package name: "${v}"`);
  }
  return n;
}

function updatePackageFiles(name: string) {
  const pkg = JSON.parse(
    fs.readFileSync("package.json", "utf8"),
  ) as PackageJson;
  pkg.name = name;
  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");

  const lock = JSON.parse(
    fs.readFileSync("package-lock.json", "utf8"),
  ) as PackageJson;
  lock.name = name;
  if (lock.packages?.[""]) {
    lock.packages[""].name = name;
  }
  fs.writeFileSync("package-lock.json", JSON.stringify(lock, null, 2) + "\n");

  if (fs.existsSync("wrangler.jsonc")) {
    replaceInFile("wrangler.jsonc", /"name": ".*"/, `"name": "${name}"`);
  }
}

function updateEnvFiles(siteUrl: string) {
  replaceInFile(".env.example", /^SITE_URL=.*$/m, `SITE_URL=${siteUrl}`);
  if (!fs.existsSync(".env")) {
    fs.writeFileSync(".env", fs.readFileSync(".env.example", "utf8"));
  } else {
    replaceInFile(".env", /^SITE_URL=.*$/m, `SITE_URL=${siteUrl}`);
  }
}

function updateCodeowners(owner: string) {
  // Normalise: ensure leading @, support both @user and @org/team
  const u = owner.startsWith("@") ? owner : `@${owner}`;
  // Match @word, @word/word, @word-word/word-word, etc.
  replaceAllInFile(".github/CODEOWNERS", /@[\w-]+(?:\/[\w-]+)?/g, u);
}

function updateContactAction(action: string) {
  replaceInFile(
    "src/config/site.ts",
    /contactAction:\s*"[^"]*"/,
    `contactAction: "${action}"`,
  );
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
