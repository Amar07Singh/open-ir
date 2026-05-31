// SPDX-License-Identifier: AGPL-3.0-only WITH non-commercial-clause

/**
 * Stable identifiers for every entry in the remedy catalog — the *keys* of the
 * key/value pairs. Each member's value is the exact `@bb/errors` class `name`,
 * so the same code resolves a remedy whether you pass a thrown error (looked up
 * by `error.name`) or the key directly (`resolveRemedy(ErrorKey.MongoConfigError)`).
 *
 * Using this enum to key the catalogs (and to call `resolveRemedy`) replaces
 * bare magic strings: a typo'd key is a compile error, not a silent miss.
 */
export enum ErrorKey {
  // config-remedies
  ConfigIncompleteError = "ConfigIncompleteError",

  // server-remedies
  ServerConfigError = "ServerConfigError",
  ServerStartTimeoutError = "ServerStartTimeoutError",
  ServerProcessExitedError = "ServerProcessExitedError",
  ServerInfraDownError = "ServerInfraDownError",
  ServerInfraUnreachableError = "ServerInfraUnreachableError",
  LayoutMigrationRequiredError = "LayoutMigrationRequiredError",

  // infra-remedies
  MongoConfigError = "MongoConfigError",
  MongoConnectError = "MongoConnectError",
  MongoNotConnectedError = "MongoNotConnectedError",
  RedisConfigError = "RedisConfigError",
  RedisConnectError = "RedisConnectError",
  RedisNotConnectedError = "RedisNotConnectedError",
  Neo4jConfigError = "Neo4jConfigError",
  Neo4jConnectError = "Neo4jConnectError",
  Neo4jNotConnectedError = "Neo4jNotConnectedError",
  QueueConnectError = "QueueConnectError",
  QueueNotConnectedError = "QueueNotConnectedError",

  // llm-remedies
  LlmConfigError = "LlmConfigError",
  LlmError = "LlmError",

  // ingest-remedies
  GitCloneError = "GitCloneError",
  IngestError = "IngestError",
  IngestPathError = "IngestPathError",
  CancellationError = "CancellationError",
  UsageLimitExceededError = "UsageLimitExceededError",
  KnowledgeNotFoundError = "KnowledgeNotFoundError",
}
