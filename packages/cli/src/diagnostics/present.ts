// SPDX-License-Identifier: AGPL-3.0-only WITH non-commercial-clause
import { readFileSync } from "node:fs";
import { resolveRemedy, type Remedy } from "@bb/errors";
import { error, info, list } from "#src/output.ts";

// How many of the last log lines to show when a boot fails.
const LOG_TAIL_LINES = 12;

// Safely read a string field (e.g. `logPath`) off an unknown error object.
function readField(value: unknown, key: string): string | undefined {
  if (typeof value === "object" && value !== null && key in value) {
    const field = (value as Record<string, unknown>)[key];
    return typeof field === "string" ? field : undefined;
  }
  return undefined;
}

// Reading the log is I/O — it deliberately lives here in the CLI, never in the
// kernel remedy catalog. Surfaces the actionable lines a failed server already
// wrote (e.g. "Run: bytebell migrate paths") instead of just "check the log".
function readLogTail(logPath: string, max: number): string[] {
  try {
    const lines = readFileSync(logPath, "utf8")
      .split("\n")
      .map((line) => line.trimEnd())
      .filter((line) => line.length > 0);
    return lines.slice(-max);
  } catch {
    return [];
  }
}

/** Render a resolved remedy. `calm` drops the error styling (used for cancellations). */
export function presentRemedy(remedy: Remedy, calm = false): void {
  // First line: the headline. Red "✗" for errors, plain text when "calm"
  // (e.g. a user-cancelled action isn't really a failure).
  if (calm) {
    info(remedy.title);
  } else {
    error(remedy.title);
  }
  // Then the list of fix steps, with an optional docs link tacked on the end.
  const steps = [...remedy.fix];
  if (remedy.docs !== undefined) {
    steps.push(`Docs: ${remedy.docs}`);
  }
  // Use the "why" line as the heading above the steps if we have one.
  list(remedy.why ?? "Next steps:", steps);
}

/** Top-level error presenter: resolve a remedy and print it with any log context. */
export function presentThrownError(cause: unknown): void {
  // Look up the friendly message for whatever was thrown.
  const remedy = resolveRemedy(cause);
  // For boot failures the real reason is in the server log. Grab the last few
  // lines so we can show them inline instead of telling the user to go dig.
  const tail: string[] = [];
  if (cause instanceof Error) {
    if (cause.name === "ServerStartTimeoutError") {
      // The error tells us where the log file is — read its tail.
      const logPath = readField(cause, "logPath");
      if (logPath !== undefined) {
        tail.push(...readLogTail(logPath, LOG_TAIL_LINES));
      }
    } else if (cause.name === "ServerProcessExitedError") {
      // This error already captured the log text — just take its last lines.
      const logTail = readField(cause, "logTail");
      if (logTail !== undefined) {
        tail.push(
          ...logTail
            .split("\n")
            .map((line) => line.trimEnd())
            .filter((line) => line.length > 0)
            .slice(-LOG_TAIL_LINES),
        );
      }
    }
  }
  // A user-cancelled action is shown calmly (no scary red ✗).
  const calm = cause instanceof Error && cause.name === "CancellationError";
  // If we grabbed log lines, append them under a separator; otherwise print as-is.
  const enriched: Remedy =
    tail.length > 0 ? { ...remedy, fix: [...remedy.fix, "—— from the log ——", ...tail] } : remedy;
  presentRemedy(enriched, calm);
}
