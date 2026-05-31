export { ConfigIncompleteError } from "./config-errors.ts";
export { KnowledgeNotFoundError, MongoConfigError, MongoConnectError, MongoNotConnectedError } from "./mongo-errors.ts";
export { RedisConfigError, RedisConnectError, RedisNotConnectedError } from "./redis-errors.ts";
export { QueueConnectError, QueueNotConnectedError } from "./queue-errors.ts";
export { LlmConfigError, LlmError } from "./llm-errors.ts";
export {
  CancellationError,
  GitCloneError,
  IngestError,
  IngestPathError,
  UsageLimitExceededError,
} from "./ingest-errors.ts";
export type { UsageLimitExceededDetail } from "./ingest-errors.ts";
export {
  ServerConfigError,
  ServerStartTimeoutError,
  ServerInfraDownError,
  ServerInfraUnreachableError,
  ServerProcessExitedError,
} from "./server-errors.ts";
export { Neo4jConfigError, Neo4jConnectError, Neo4jNotConnectedError } from "./neo4j-errors.ts";
export { LayoutMigrationRequiredError } from "./layout-errors.ts";

// Remedy catalog — the structured fix/explanation surface. `ErrorKey` is the
// key type; pass it (or a thrown error) to `resolveRemedy`.
export { ErrorKey } from "./remedies/keys.ts";
export { resolveRemedy, hasRemedy } from "./remedies/resolve.ts";
export type { Remedy } from "./remedies/Remedy.ts";
