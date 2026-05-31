// SPDX-License-Identifier: AGPL-3.0-only WITH non-commercial-clause
import type { Remedy } from "./Remedy.ts";
import { ErrorKey } from "./keys.ts";
import { RemedyText } from "./messages.ts";

// Keyed by the error class `name` (via ErrorKey). The exact `bytebell set …`
// lines are spliced in at resolve time from the error's `hints` / `hint` field.
export const configRemedies: Partial<Record<ErrorKey, Remedy>> = {
  [ErrorKey.ConfigIncompleteError]: {
    title: RemedyText.ConfigIncompleteTitle,
    why: RemedyText.ConfigIncompleteWhy,
    fix: [RemedyText.SetMissingKeys],
  },
};
