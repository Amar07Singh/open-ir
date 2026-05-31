// SPDX-License-Identifier: AGPL-3.0-only WITH non-commercial-clause
import type { Remedy } from "./Remedy.ts";
import type { ErrorKey } from "./keys.ts";
import { REMEDIES } from "./registry.ts";

// Used when we have no specific remedy — at least point the user at the logs
// so they're never left with a totally silent failure.
const FALLBACK: Remedy = {
  title: "Something went wrong.",
  fix: ["Check the logs for details: ~/.bytebell/logs/", "If it persists, re-run the command and report the output."],
};

// The next three are tiny, safe "read a field off an unknown value" helpers.
// The input might be an Error, a plain object, or anything — so we check the
// shape before touching it instead of assuming.

// Treat the value as an object if it actually is one (else give up).
function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : undefined;
}

// Return value[key] only if it's a string.
function readString(value: unknown, key: string): string | undefined {
  const field = asRecord(value)?.[key];
  return typeof field === "string" ? field : undefined;
}

// Return value[key] only if it's an array of strings.
function readStringArray(value: unknown, key: string): readonly string[] | undefined {
  const field = asRecord(value)?.[key];
  return Array.isArray(field) && field.every((item) => typeof item === "string") ? (field as string[]) : undefined;
}

// Work out which catalog entry to use: an `ErrorKey` (or any string) is the
// code itself; an error is looked up by its `.name` (e.g. "MongoConnectError").
function keyOf(input: unknown): string {
  if (typeof input === "string") {
    return input;
  }
  return readString(input, "name") ?? "Unknown";
}

/** True when `code` (an `ErrorKey`, an error `name`, or any string) has a catalog entry. */
export function hasRemedy(code: ErrorKey | string): boolean {
  return Object.prototype.hasOwnProperty.call(REMEDIES, code);
}

/**
 * Resolve a `Remedy` for a thrown error instance or an `ErrorKey` (passed as a
 * plain string at runtime — the enum's values are its catalog keys). Pure: it
 * only reads structured fields off the input (never parses `error.message`) and
 * performs no I/O. Unknown inputs return a safe fallback so every error always
 * has a next step.
 */
export function resolveRemedy(input: ErrorKey | unknown): Remedy {
  // Start from the catalog entry for this error/code. With no curated remedy,
  // fall back — but keep the error's own `message` as the headline rather than a
  // generic "Something went wrong.", so an un-cataloged error never loses its
  // detail (the presenter is then always at least as informative as the raw text).
  const matched = REMEDIES[keyOf(input)];
  const base: Remedy = matched ?? { ...FALLBACK, title: readString(input, "message") ?? FALLBACK.title };

  // Some errors carry their own specifics (e.g. the exact `bytebell set …`
  // command, or which knowledgeId failed). Pull those out and add them as
  // extra fix steps so the message is concrete, not generic.
  const extra: string[] = [];
  const hints = readStringArray(input, "hints");
  if (hints !== undefined) {
    extra.push(...hints);
  }
  const hint = readString(input, "hint");
  if (hint !== undefined) {
    extra.push(hint);
  }
  const knowledgeId = readString(input, "knowledgeId");
  if (knowledgeId !== undefined) {
    extra.push(`Affected knowledgeId: ${knowledgeId}`);
  }
  const path = readString(input, "path");
  if (path !== undefined) {
    extra.push(`Path: ${path}`);
  }

  // Nothing extra to add — return the catalog entry unchanged.
  if (extra.length === 0) {
    return base;
  }
  // Append the extra steps, skipping any that are already in the base list so
  // we don't print the same line twice.
  const seen = new Set<string>(base.fix);
  const fix = [...base.fix];
  for (const line of extra) {
    if (!seen.has(line)) {
      seen.add(line);
      fix.push(line);
    }
  }
  return { ...base, fix };
}
