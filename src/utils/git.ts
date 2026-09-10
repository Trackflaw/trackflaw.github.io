import { execFileSync } from "node:child_process";

/**
 * Build-time helpers around the git CLI. Every failure (git missing, not a
 * repository, timeout, no network) resolves to `null` so the build never
 * breaks because of it: callers simply get no date.
 */
function git(args: string[], timeout = 15_000): string | null {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout,
    }).trim();
  } catch {
    return null;
  }
}

let historyReady: boolean | undefined;

/**
 * Makes sure the full commit history is available before dating files.
 *
 * CI runners (Cloudflare Builds among them) clone with `--depth=1`, which
 * makes every file look like it was last touched by the HEAD commit. In that
 * case the missing history is fetched without its blobs (`--filter=blob:none`):
 * commits and trees are all `git log -- <path>` needs, and it stays small even
 * on a repository whose history carries heavy binaries.
 */
function ensureHistory(): boolean {
  if (historyReady !== undefined) return historyReady;
  const shallow = git(["rev-parse", "--is-shallow-repository"]);
  if (shallow === null) return (historyReady = false);
  if (shallow === "true") {
    git(["fetch", "--quiet", "--unshallow", "--filter=blob:none"], 120_000);
  }
  historyReady = git(["rev-parse", "--is-shallow-repository"]) === "false";
  return historyReady;
}

/**
 * ISO 8601 committer date of the most recent commit touching any of `paths`
 * (relative to the repository root), or `null` when no trustworthy date can
 * be computed. An inaccurate date is worse than none for search engines.
 */
export function lastCommitDate(paths: string[]): string | null {
  if (paths.length === 0 || !ensureHistory()) return null;
  return git(["log", "-1", "--format=%cI", "--", ...paths]) || null;
}
