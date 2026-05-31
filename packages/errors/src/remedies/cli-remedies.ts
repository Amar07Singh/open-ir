// SPDX-License-Identifier: AGPL-3.0-only WITH non-commercial-clause
import type { Remedy } from "./Remedy.ts";
import type { ErrorKey } from "./keys.ts";

// CLI-only conditions that are reported without throwing an @bb/errors class.
// (Currently none: the "no coding tools detected" case prints its plain message
// directly from `mcpInstall.ts` rather than going through a curated remedy.)
export const cliRemedies: Partial<Record<ErrorKey, Remedy>> = {};
