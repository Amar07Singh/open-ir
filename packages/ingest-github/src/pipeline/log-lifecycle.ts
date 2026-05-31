// SPDX-License-Identifier: AGPL-3.0-only WITH non-commercial-clause
import { resetLogScope } from "@bb/logger";

// Wipe-after-success state. The server is long-lived and runs many index jobs
// against one shared server log. We only clear that log when the *previous* run
// finished cleanly — a failed (or cancelled) run leaves its log on disk so it
// can be debugged. The flag is in-process and defaults to false, so a fresh
// server never wipes until it has seen one successful run.
let previousRunSucceeded = false;

/**
 * Call at the start of an index run. If the previous run succeeded, wipe the
 * server log so this run writes a clean narrative from scratch ("deleted and
 * rewritten"). A failed previous run leaves the flag false, so its log is kept.
 */
export function resetServerLogIfPreviousSucceeded(): void {
  if (previousRunSucceeded) {
    resetLogScope("server");
    previousRunSucceeded = false;
  }
}

/** Record how a run ended, so the next run knows whether to wipe first. */
export function markRunOutcome(succeeded: boolean): void {
  previousRunSucceeded = succeeded;
}
