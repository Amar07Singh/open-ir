# `@bb/errors/src/remedies` — context

Tier: **kernel** (pure data). The remedy catalog that turns an error into a
user-facing _what / why / next-command_. Co-located with the error classes so
"an error and its fix" live in one place.

## Responsibilities

- Map each catalog key (an `ErrorKey`, whose value is the `@bb/errors` class
  `name`) to a `Remedy { title, why?, fix[], docs? }`.
- Resolve a `Remedy` for any error instance or `ErrorKey`, splicing the error's
  own structured fields (`hints`, `hint`, `knowledgeId`, `path`) into the steps.

## Public interfaces (re-exported from `@bb/errors`)

- `Remedy` — [Remedy.ts](Remedy.ts)
- `ErrorKey` — [keys.ts](keys.ts) — the catalog key enum; pass it (or a thrown
  error) to `resolveRemedy`, and key the catalogs with it.
- `resolveRemedy(input: ErrorKey | unknown): Remedy` — [resolve.ts](resolve.ts)
- `hasRemedy(code: ErrorKey | string): boolean` — [resolve.ts](resolve.ts)

## Layout

One file per area, mirroring the `*-errors.ts` split:
`config-remedies.ts`, `server-remedies.ts`, `infra-remedies.ts`,
`llm-remedies.ts`, `ingest-remedies.ts`, `cli-remedies.ts` — each typed
`Partial<Record<ErrorKey, Remedy>>` and keyed by `[ErrorKey.X]`, merged by
[registry.ts](registry.ts). The keys live in [keys.ts](keys.ts).

The static copy itself (every constant `title` / `why` / `fix` string) lives in
the `RemedyText` enum in [messages.ts](messages.ts); the area files reference its
members rather than inlining literals. Text that interpolates a runtime value
(e.g. the `notConnected` title) stays inline.

## Invariants

- **No I/O, no logging, no imports beyond `./` siblings.** Same kernel rule as
  the rest of `@bb/errors`. Rendering (and reading the server log tail) lives in
  the CLI presenter, not here.
- **Typed metadata, not message parsing.** `resolveRemedy` reads `error.name`
  and structured fields — never `error.message`.
- **Exhaustive.** Every exported error class is expected to have a catalog
  entry; unmatched errors fall back to a generic "check the logs" remedy.

## Adding a remedy

1. Add the key to `ErrorKey` in [keys.ts](keys.ts) (member name = value = the
   error class `name`).
2. Add an entry `[ErrorKey.NewKey]: { … }` in the matching `*-remedies.ts` file
   (or create a new area file and spread it into `registry.ts`).

Because each catalog is `Partial<Record<ErrorKey, Remedy>>`, a mistyped key is a
compile error and keys autocomplete.
