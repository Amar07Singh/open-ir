// SPDX-License-Identifier: AGPL-3.0-only WITH non-commercial-clause
import type { Remedy } from "./Remedy.ts";
import { ErrorKey } from "./keys.ts";
import { RemedyText } from "./messages.ts";

// Fixes for indexing/ingestion problems: clone failures, bad paths, usage
// limits, and cancellation.
export const ingestRemedies: Partial<Record<ErrorKey, Remedy>> = {
  [ErrorKey.GitCloneError]: {
    title: RemedyText.GitCloneTitle,
    why: RemedyText.GitCloneWhy,
    fix: [RemedyText.GitCloneFixToken, RemedyText.GitCloneFixVerify],
  },
  [ErrorKey.IngestError]: {
    title: RemedyText.IngestFailedTitle,
    fix: [RemedyText.IngestFailedFix],
  },
  [ErrorKey.IngestPathError]: {
    title: RemedyText.IngestPathTitle,
    why: RemedyText.IngestPathWhy,
    fix: [RemedyText.IngestPathFix],
  },
  [ErrorKey.CancellationError]: {
    title: RemedyText.CancelledTitle,
    fix: [RemedyText.CancelledFix],
  },
  [ErrorKey.UsageLimitExceededError]: {
    title: RemedyText.UsageLimitTitle,
    why: RemedyText.UsageLimitWhy,
    fix: [RemedyText.UsageLimitFix],
  },
  [ErrorKey.KnowledgeNotFoundError]: {
    title: RemedyText.KnowledgeNotFoundTitle,
    fix: [RemedyText.KnowledgeNotFoundFix],
  },
};
