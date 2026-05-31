// SPDX-License-Identifier: AGPL-3.0-only WITH non-commercial-clause
import type { Remedy } from "./Remedy.ts";
import { ErrorKey } from "./keys.ts";
import { RemedyText } from "./messages.ts";

// Same message for every "used before it was connected" bug (Mongo/Redis/Neo4j/
// queue). These mean a code path forgot to connect first — a bug, not user error.
// The title names the system, so it stays an inline template; the rest is static.
const notConnected = (system: string): Remedy => ({
  title: `Internal: ${system} was used before it was connected.`,
  why: RemedyText.NotConnectedWhy,
  fix: [RemedyText.NotConnectedReport],
});

// Fixes for the database/queue adapters: missing config, can't connect, etc.
export const infraRemedies: Partial<Record<ErrorKey, Remedy>> = {
  [ErrorKey.MongoConfigError]: {
    title: RemedyText.MongoConfigTitle,
    fix: [RemedyText.MongoConfigFix],
  },
  [ErrorKey.MongoConnectError]: {
    title: RemedyText.MongoConnectTitle,
    why: RemedyText.MongoConnectWhy,
    fix: [RemedyText.MongoConnectFix, RemedyText.BootBringsUpInfra],
  },
  [ErrorKey.MongoNotConnectedError]: notConnected("MongoDB"),
  [ErrorKey.RedisConfigError]: {
    title: RemedyText.RedisConfigTitle,
    fix: [RemedyText.RedisConfigFix],
  },
  [ErrorKey.RedisConnectError]: {
    title: RemedyText.RedisConnectTitle,
    why: RemedyText.RedisConnectWhy,
    fix: [RemedyText.RedisConnectFix, RemedyText.BootBringsUpInfra],
  },
  [ErrorKey.RedisNotConnectedError]: notConnected("Redis"),
  [ErrorKey.Neo4jConfigError]: {
    title: RemedyText.Neo4jConfigTitle,
    fix: [RemedyText.Neo4jConfigFix],
  },
  [ErrorKey.Neo4jConnectError]: {
    title: RemedyText.Neo4jConnectTitle,
    why: RemedyText.Neo4jConnectWhy,
    fix: [RemedyText.Neo4jConnectFix, RemedyText.BootBringsUpInfra],
  },
  [ErrorKey.Neo4jNotConnectedError]: notConnected("Neo4j"),
  [ErrorKey.QueueConnectError]: {
    title: RemedyText.QueueConnectTitle,
    why: RemedyText.QueueConnectWhy,
    fix: [RemedyText.QueueConnectFix],
  },
  [ErrorKey.QueueNotConnectedError]: notConnected("the job queue"),
};
