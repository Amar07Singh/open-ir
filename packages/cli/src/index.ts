#!/usr/bin/env bun
import { Command } from "commander";
import { buildSetCommand } from "./SetCommand.ts";
import { buildServerCommand } from "./ServerCommand.ts";
import { buildIndexCommand } from "./IndexCommand.ts";
import { buildIngestCommand } from "./IngestCommand.ts";
import { buildPullCommand } from "./PullCommand.ts";
import { buildLsCommand } from "./LsCommand.ts";
import { buildBootCommand } from "./BootCommand.ts";
import { buildShutdownCommand } from "./ShutdownCommand.ts";
import { buildDeleteCommand } from "./DeleteCommand.ts";
import { buildStatsCommand } from "./StatsCommand.ts";
import { buildMcpCommand } from "./McpCommand.ts";
import { buildSetupCommand } from "./SetupCommand.ts";
import { buildMigrateCommand } from "./MigratePathsCommand.ts";
import { presentThrownError } from "./diagnostics/present.ts";

const VERSION = "0.0.0";

async function main(): Promise<void> {
  const program = new Command("bytebell");
  program.version(VERSION).description("Bytebell — local knowledge engine TUI");
  program.addCommand(buildSetCommand());
  program.addCommand(buildSetupCommand());
  program.addCommand(buildBootCommand());
  program.addCommand(buildShutdownCommand());
  program.addCommand(buildServerCommand());
  program.addCommand(buildIndexCommand());
  program.addCommand(buildIngestCommand());
  program.addCommand(buildPullCommand());
  program.addCommand(buildLsCommand());
  program.addCommand(buildDeleteCommand());
  program.addCommand(buildStatsCommand());
  program.addCommand(buildMcpCommand());
  program.addCommand(buildMigrateCommand());
  await program.parseAsync(process.argv);
}

main().catch((cause: unknown) => {
  // Render the full remedy (✗ title + why + fix steps, plus a boot log tail when
  // the error carries one) instead of a bare message. Falls back to a generic
  // "check the logs" remedy for unrecognised errors.
  presentThrownError(cause);
  process.exit(2);
});
