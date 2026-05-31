# `@bb/cli/src/diagnostics` — context

Tier: **binary** (CLI presentation). The thin layer that prints an error's
remedy to the terminal. It is the _only_ place that does I/O for remedies —
the remedy text itself is pure data owned by `@bb/errors` (`resolveRemedy`).

## Responsibilities

- Resolve a `Remedy` for any thrown error (or condition) and render it via
  `output.ts` (`error` / `info` / `list`).
- For boot failures, read the tail of the server log the error points at
  (`ServerStartTimeoutError.logPath`, `ServerProcessExitedError.logTail`) and
  surface the actionable lines — so the fix is shown inline, not buried.

## Public interfaces (exports)

- `presentThrownError(cause: unknown): void` — the top-level `main().catch` presenter.
- `presentRemedy(remedy: Remedy, calm?: boolean): void` — render a resolved
  remedy (e.g. for a non-throwing condition).

## Invariants

- **No remedy text here.** Wording lives in `@bb/errors/src/remedies`; this
  module only formats and prints it.
- **Downward import only.** Depends on `@bb/errors` (kernel) — never the reverse.
