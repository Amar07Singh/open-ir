// SPDX-License-Identifier: AGPL-3.0-only WITH non-commercial-clause

/**
 * Static, fully-constant error-class messages.
 *
 * Only literal strings live here. Messages that splice in a runtime value
 * (ids, URIs, paths, causes) stay as inline template strings at the throw site,
 * since a string enum can only hold constants.
 */
export enum ErrorMessage {
  MongoNotConnected = "MongoDB client is not connected. Call connectMongo() first.",
  RedisNotConnected = "Redis client is not connected. Call connectRedis() first.",
  Neo4jNotConnected = "Neo4j driver is not connected. Call connectNeo4j() first.",
  QueueNotConnected = "Queue is not connected. Call connectQueue() first.",
}
