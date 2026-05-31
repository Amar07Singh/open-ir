import fs from "node:fs";
import winston from "winston";
import { getConfigValue } from "@bb/config";
import { Config } from "@bb/types";
import { currentLogFile, ensureLogsDir } from "./dirs.ts";
import { flushTransport, makeConsoleTransport, makeFileTransport } from "./transports.ts";

export type LoggerScope = "server" | "cli";

export type LoggerFactory = (scope: LoggerScope) => winston.Logger;

const scopeLoggers = new Map<LoggerScope, winston.Logger>();
let seededFactory: LoggerFactory | null = null;

function buildLogger(scope: LoggerScope): winston.Logger {
  ensureLogsDir();
  const level = getConfigValue(Config.LogLevel);
  return winston.createLogger({
    level,
    transports: [makeFileTransport(scope), makeConsoleTransport()],
  });
}

export function seedLoggerFactory(factory: LoggerFactory): void {
  seededFactory = factory;
  scopeLoggers.clear();
}

export function __isLoggerFactorySeeded(): boolean {
  return seededFactory !== null;
}

export function getLogger(scope: LoggerScope): winston.Logger {
  const cached = scopeLoggers.get(scope);
  if (cached !== undefined) {
    return cached;
  }
  const logger = seededFactory !== null ? seededFactory(scope) : buildLogger(scope);
  scopeLoggers.set(scope, logger);
  return logger;
}

/**
 * Wipe a scope's current log file and rebuild its logger.
 *
 * Closes the active winston logger (so its file stream releases its position),
 * truncates today's `<scope>-<date>.log` to zero, and drops the cache so the
 * next `getLogger(scope)` opens a fresh stream at offset 0. The CLI's spawn
 * redirect opens the same file with `O_APPEND`, which tolerates the truncation
 * (its writes resume at the new end-of-file).
 *
 * Used for "wipe after success": clearing a completed run's log so the next run
 * starts clean. Best-effort — a missing file is a no-op.
 */
export function resetLogScope(scope: LoggerScope): void {
  const existing = scopeLoggers.get(scope);
  if (existing !== undefined) {
    existing.close();
    scopeLoggers.delete(scope);
  }
  try {
    fs.truncateSync(currentLogFile(scope), 0);
  } catch {
    // File not created yet (nothing logged this day) — nothing to wipe.
  }
}

export async function shutdownLoggers(): Promise<void> {
  const transports: winston.transport[] = [];
  for (const logger of scopeLoggers.values()) {
    transports.push(...logger.transports);
    logger.close();
  }
  await Promise.all(transports.map(flushTransport));
  scopeLoggers.clear();
}

export function __resetLoggersForTests(): void {
  for (const logger of scopeLoggers.values()) {
    logger.close();
  }
  scopeLoggers.clear();
  seededFactory = null;
}
