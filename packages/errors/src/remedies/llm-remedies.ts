// SPDX-License-Identifier: AGPL-3.0-only WITH non-commercial-clause
import type { Remedy } from "./Remedy.ts";
import { ErrorKey } from "./keys.ts";
import { RemedyText } from "./messages.ts";

// Fixes for the LLM layer (OpenRouter / Ollama): missing API key, or a failed
// request (the steps cover the common HTTP status codes).
export const llmRemedies: Partial<Record<ErrorKey, Remedy>> = {
  [ErrorKey.LlmConfigError]: {
    title: RemedyText.LlmConfigTitle,
    fix: [RemedyText.LlmConfigFix],
  },
  [ErrorKey.LlmError]: {
    title: RemedyText.LlmErrorTitle,
    why: RemedyText.LlmErrorWhy,
    fix: [RemedyText.LlmErrorAuth, RemedyText.LlmErrorRateLimit, RemedyText.LlmErrorServer],
  },
};
