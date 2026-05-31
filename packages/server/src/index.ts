#!/usr/bin/env bun
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import express from "express";
import { Config, DbProviderType, type Config as ConfigEnum } from "@bb/types";
import { getBytebellHome, getConfigValue, HINTS } from "@bb/config";
import { connectDb } from "@bb/db";
import { connectRedis } from "@bb/redis";
import { connectGraph, indexesGraph } from "@bb/graph-db";
import { connectQueue } from "@bb/queue";
import "@bb/mongo";
import "@bb/sqlite";
import "@bb/neo4j";
import { registerGithubWorkers, registerLocalIngestWorker } from "@bb/ingest-github";
import { LayoutMigrationRequiredError, ServerConfigError } from "@bb/errors";
import { logger } from "@bb/logger";
import { registerRoutes } from "./routes.ts";
import { installShutdownHandlers } from "./shutdown.ts";

const REQUIRED: ConfigEnum[] = [
  Config.MongoUri,
  Config.RedisUrl,
  Config.Neo4jUri,
  Config.Neo4jUser,
  Config.Neo4jPassword,
  Config.OpenrouterApiKey,
];

function checkRequiredConfig(): void {
  const missing: string[] = [];
  const hints: string[] = [];
  const dbProvider = getConfigValue(Config.DbProvider);

  const required = [...REQUIRED];
  if (dbProvider !== DbProviderType.Mongo) {
    const idx = required.indexOf(Config.MongoUri);
    if (idx !== -1) {
      required.splice(idx, 1);
    }
  }

  for (const key of required) {
    const value = getConfigValue(key);
    if (typeof value === "string" && value.length === 0) {
      missing.push(key);
      hints.push(HINTS[key]);
    }
  }
  if (missing.length > 0) {
    throw new ServerConfigError(missing, hints);
  }
}

/**
 * Refuses to boot if the legacy `repos/.meta/<knowledgeId>/` layout is on
 * disk. The kube-v2 layout is the only path resolver this build understands;
 * mixing the two would mean mid-flight code reading from one tree and writing
 * to the other. Operators run `bytebell migrate paths` once after the
 * upgrade — see `packages/cli/src/commands/MigratePathsCommand.ts`.
 */
async function assertLayoutMigrated(): Promise<void> {
  const legacyMetaRoot = path.join(getBytebellHome(), "repos", ".meta");
  try {
    const entries = await readdir(legacyMetaRoot);
    if (entries.length === 0) {
      return; // empty dir — vestigial, ignore
    }
    throw new LayoutMigrationRequiredError(legacyMetaRoot);
  } catch (cause: unknown) {
    if (cause instanceof LayoutMigrationRequiredError) {
      throw cause;
    }
    // ENOENT — legacy layout never existed on this machine; nothing to migrate.
    if (cause instanceof Error && "code" in cause && (cause as { code?: unknown }).code === "ENOENT") {
      return;
    }
    throw cause;
  }
}

async function main(): Promise<void> {
  logger.info("bytebell-server: starting up…");
  checkRequiredConfig();
  await assertLayoutMigrated();
  const dbProvider = getConfigValue(Config.DbProvider);
  await connectDb(dbProvider);
  logger.info(`bytebell-server: ✓ database connected (provider=${dbProvider})`);

  await connectRedis();
  logger.info("bytebell-server: ✓ redis connected");

  const graphProvider = getConfigValue(Config.GraphProvider);
  await connectGraph(graphProvider);
  await indexesGraph.ensureKnowledgeIndexes();
  await indexesGraph.ensureConceptGraphIndexes();
  logger.info(`bytebell-server: ✓ graph connected (provider=${graphProvider}), indexes ensured`);

  await connectQueue();
  registerGithubWorkers();
  registerLocalIngestWorker();
  logger.info("bytebell-server: ✓ queue connected, ingestion workers registered");
  installShutdownHandlers();

  const app = express();
  app.use(express.json({ limit: "1mb" }));
  registerRoutes(app);

  const port = getConfigValue(Config.ServerPort);
  app.listen(port, "127.0.0.1", () => {
    // stdout marker stays for humans tailing the file; readiness is detected
    // by the CLI via the /health endpoint, not this line.
    process.stdout.write(`Bytebell server listening on http://127.0.0.1:${port}\n`);
    logger.info(`bytebell-server: ✓ up and listening on http://127.0.0.1:${port}`);
  });

  await writeFile(path.join(getBytebellHome(), "pid"), String(process.pid), { mode: 0o644 });
}

main().catch((cause: unknown) => {
  if (cause instanceof ServerConfigError) {
    process.stderr.write(`${cause.message}\n`);
    process.exit(1);
  }
  process.stderr.write(`${cause instanceof Error ? cause.message : String(cause)}\n`);
  process.exit(1);
});
