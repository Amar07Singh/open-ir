// SPDX-License-Identifier: AGPL-3.0-only WITH non-commercial-clause
import type { Remedy } from "./Remedy.ts";
import { configRemedies } from "./config-remedies.ts";
import { serverRemedies } from "./server-remedies.ts";
import { infraRemedies } from "./infra-remedies.ts";
import { llmRemedies } from "./llm-remedies.ts";
import { ingestRemedies } from "./ingest-remedies.ts";
import { cliRemedies } from "./cli-remedies.ts";

/**
 * The merged remedy catalog. Each source object is keyed by `ErrorKey` (whose
 * values are the `@bb/errors` class `name`s); merged here into a plain string
 * map so `resolveRemedy` can also look up by a raw `error.name` at runtime.
 */
export const REMEDIES: Readonly<Record<string, Remedy>> = {
  ...configRemedies,
  ...serverRemedies,
  ...infraRemedies,
  ...llmRemedies,
  ...ingestRemedies,
  ...cliRemedies,
};
