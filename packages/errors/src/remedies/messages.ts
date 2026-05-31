// SPDX-License-Identifier: AGPL-3.0-only WITH non-commercial-clause

/**
 * Static remedy copy (title / why / fix steps) for the catalog.
 *
 * Only constant strings live here. Remedy text that interpolates a runtime
 * value (e.g. the `notConnected` title, which names the system) stays inline.
 * Steps reused across several remedies are declared once and referenced from
 * each entry.
 */
export enum RemedyText {
  // Steps shared by more than one remedy.
  SetMissingKeys = "Set the missing keys (the exact commands follow):",
  BootBringsUpInfra = "bytebell boot brings up the bundled infra.",

  // config-remedies — ConfigIncompleteError
  ConfigIncompleteTitle = "Bytebell configuration is incomplete.",
  ConfigIncompleteWhy = "One or more required settings are missing from ~/.bytebell/config.json.",

  // server-remedies
  ServerConfigTitle = "The server is missing required configuration.",
  ServerConfigWhy = "bytebell-server refuses to boot until every required key is set.",
  ServerTimeoutTitle = "The server did not become healthy in time.",
  ServerTimeoutWhy = "It was spawned but failed its health check before the timeout. The real cause is in the log below.",
  ServerTimeoutReadLog = "Read the log lines below — they often name the exact fix (e.g. `bytebell migrate paths`).",
  ServerTimeoutRetry = "Then retry: bytebell boot",
  ServerExitedTitle = "The server process exited immediately after starting.",
  ServerExitedWhy = "It crashed during boot. The tail of its log (below) holds the cause.",
  ServerExitedFix = "Fix the cause shown in the log tail below, then: bytebell boot",
  ServerInfraDownTitle = "The server started but its infra is not reachable.",
  ServerInfraDownWhy = "Mongo / Neo4j / Redis containers are not up.",
  ServerInfraDownFix = "Make sure Docker is running, then bring infra up: bytebell boot",
  ServerInfraUnreachableTitle = "Infra was not reachable before the server could start.",
  ServerInfraUnreachableWhy = "The configured Mongo / Neo4j / Redis endpoints did not answer.",
  ServerInfraUnreachableFix = "Confirm Docker is running and the URIs are correct, then: bytebell boot",
  LayoutLegacyTitle = "Your ~/.bytebell on-disk layout is the legacy format.",
  LayoutLegacyWhy = "This build expects the commit-scoped layout under orgs/<orgId>/<provider>/.",
  LayoutLegacyFix = "bytebell migrate paths",

  // infra-remedies — notConnected (title interpolates the system name → inline)
  NotConnectedWhy = "This is a bug in bytebell, not a misconfiguration.",
  NotConnectedReport = "Please report it and include the latest log from ~/.bytebell/logs/.",
  MongoConfigTitle = "MongoDB is not configured.",
  MongoConfigFix = "Set the Mongo URI (the exact command follows):",
  MongoConnectTitle = "Could not connect to MongoDB.",
  MongoConnectWhy = "Mongo is unreachable or the credentials are wrong (credentials are redacted in the message above).",
  MongoConnectFix = "Confirm Mongo is running and the URI is correct.",
  RedisConfigTitle = "Redis is not configured.",
  RedisConfigFix = "Set the Redis URL (the exact command follows):",
  RedisConnectTitle = "Could not connect to Redis.",
  RedisConnectWhy = "Redis is unreachable or the credentials are wrong (credentials are redacted in the message above).",
  RedisConnectFix = "Confirm Redis is running and the URL is correct.",
  Neo4jConfigTitle = "Neo4j is not configured.",
  Neo4jConfigFix = "Set the Neo4j URI / user / password (the exact commands follow):",
  Neo4jConnectTitle = "Could not connect to Neo4j.",
  Neo4jConnectWhy = "Neo4j is unreachable or the credentials are wrong (credentials are redacted in the message above).",
  Neo4jConnectFix = "Confirm Neo4j is running and the bolt URI / credentials are correct.",
  QueueConnectTitle = "Could not initialize the job queue.",
  QueueConnectWhy = "BullMQ depends on Redis; queue setup failed.",
  QueueConnectFix = "Make sure Redis is running, then retry: bytebell boot",

  // llm-remedies
  LlmConfigTitle = "The OpenRouter API key is not configured.",
  LlmConfigFix = "Set your API key (the exact command follows):",
  LlmErrorTitle = "The LLM request failed.",
  LlmErrorWhy = "The provider returned an error or the call timed out.",
  LlmErrorAuth = "401 / 403 → check your API key: bytebell keys set",
  LlmErrorRateLimit = "429 → you are rate limited; wait and retry.",
  LlmErrorServer = "5xx or timeout → a provider-side issue; retry shortly.",

  // ingest-remedies
  GitCloneTitle = "git clone failed.",
  GitCloneWhy = "The URL may be wrong, the repo private, or the branch missing (credentials are redacted above).",
  GitCloneFixToken = "For a private repo, set a token: bytebell set github-token <PAT>",
  GitCloneFixVerify = "Verify the repo URL and branch exist.",
  IngestFailedTitle = "Indexing failed.",
  IngestFailedFix = "Check ~/.bytebell/logs/ for the cause, then re-run the index.",
  IngestPathTitle = "The path to ingest cannot be used.",
  IngestPathWhy = "It does not exist or is not a directory.",
  IngestPathFix = "Pass an existing directory: bytebell ingest <path>",
  CancelledTitle = "Indexing was cancelled — nothing was changed.",
  CancelledFix = "Re-run when you are ready: bytebell index <git-url>",
  UsageLimitTitle = "The LLM usage limit was exceeded during indexing.",
  UsageLimitWhy = "Cumulative token spend crossed the configured ceiling.",
  UsageLimitFix = "Raise the limit or top up your provider credit, then re-run the index.",
  KnowledgeNotFoundTitle = "No knowledge entry matches that id.",
  KnowledgeNotFoundFix = "List what exists: bytebell ls",
}
