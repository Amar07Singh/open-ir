// SPDX-License-Identifier: AGPL-3.0-only WITH non-commercial-clause
import type { Remedy } from "./Remedy.ts";
import { ErrorKey } from "./keys.ts";
import { RemedyText } from "./messages.ts";

// Fixes for things that go wrong while booting bytebell-server (and bringing up
// its Docker infra). Each entry = a startup failure + how to recover.
export const serverRemedies: Partial<Record<ErrorKey, Remedy>> = {
  [ErrorKey.ServerConfigError]: {
    title: RemedyText.ServerConfigTitle,
    why: RemedyText.ServerConfigWhy,
    fix: [RemedyText.SetMissingKeys],
  },
  [ErrorKey.ServerStartTimeoutError]: {
    title: RemedyText.ServerTimeoutTitle,
    why: RemedyText.ServerTimeoutWhy,
    fix: [RemedyText.ServerTimeoutReadLog, RemedyText.ServerTimeoutRetry],
  },
  [ErrorKey.ServerProcessExitedError]: {
    title: RemedyText.ServerExitedTitle,
    why: RemedyText.ServerExitedWhy,
    fix: [RemedyText.ServerExitedFix],
  },
  [ErrorKey.ServerInfraDownError]: {
    title: RemedyText.ServerInfraDownTitle,
    why: RemedyText.ServerInfraDownWhy,
    fix: [RemedyText.ServerInfraDownFix],
  },
  [ErrorKey.ServerInfraUnreachableError]: {
    title: RemedyText.ServerInfraUnreachableTitle,
    why: RemedyText.ServerInfraUnreachableWhy,
    fix: [RemedyText.ServerInfraUnreachableFix],
  },
  [ErrorKey.LayoutMigrationRequiredError]: {
    title: RemedyText.LayoutLegacyTitle,
    why: RemedyText.LayoutLegacyWhy,
    fix: [RemedyText.LayoutLegacyFix],
  },
};
