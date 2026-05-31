// SPDX-License-Identifier: AGPL-3.0-only WITH non-commercial-clause
import { Command } from "commander";
import { HINTS, isDevMode } from "@bb/config";
import { getLogger } from "@bb/logger";
import { checkPreflight, runBootSequence } from "./bootConfig.ts";
import { error, info } from "./output.ts";

export function buildBootCommand(): Command {
  const cmd = new Command("boot");
  cmd.description("Bring up Docker infra (mongo + neo4j + redis) and start the bytebell-server.").action(runBoot);
  return cmd;
}

async function runBoot(): Promise<void> {
  if (!enforcePreflight()) {
    process.exitCode = 1;
    return;
  }

  if (isDevMode()) {
    info(`dev mode: logs → ${process.cwd()}/logs/`);
  }

  const cliLog = getLogger("cli");
  cliLog.info("boot: bringing up Docker infra + bytebell-server…");

  if (!(await runBootSequence())) {
    cliLog.warn("boot: sequence did not complete — see output above");
    return;
  }

  cliLog.info("boot: ✓ infra + server up");
  process.stdout.write("\nNext: bytebell index <git-url>  or  bytebell ingest [path]\n");
}

function enforcePreflight(): boolean {
  const result = checkPreflight();
  if (result.ok) {
    return true;
  }
  for (const entry of result.missing) {
    error(`${entry.hintKey} is not set`, HINTS[entry.configKey]);
  }
  return false;
}
