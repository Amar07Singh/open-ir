// SPDX-License-Identifier: AGPL-3.0-only WITH non-commercial-clause

/**
 * A structured, user-facing fix for one error or condition. Pure data — this
 * module performs no I/O and imports nothing (kernel-tier invariant). The CLI
 * renders a `Remedy`; the kernel only describes it.
 */
export interface Remedy {
  /** One-line "what happened". */
  title: string;
  /** Optional "why it happened". */
  why?: string;
  /** Ordered, copy-pasteable next steps. */
  fix: readonly string[];
  /** Optional documentation pointer. */
  docs?: string;
}

/**
 * The catalog key type. Re-exported from `keys.ts`, where `ErrorKey` enumerates
 * every remedy key (one per `@bb/errors` class `name`). Callers key the catalog
 * and call `resolveRemedy` through this enum rather than bare strings.
 */
export { ErrorKey } from "./keys.ts";
