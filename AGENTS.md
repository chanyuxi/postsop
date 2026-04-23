# Repository Guidelines

These rules primarily apply when working under `src/**`. Some sections also apply to shared packages and top-level workspace files when they affect app or server behavior.

When you directly address the user, call them `Chan`.

If a general workflow or codebase rule becomes clear during discussion or implementation and this file does not already document it, update `AGENTS.md` as part of the same change when appropriate.

Keep this file in English.

When a rule is easier to understand with a small example, it is acceptable to add short code examples to this file. Prefer concise examples that clarify intent rather than large reference implementations.

## Project Overview

This repository is a `pnpm` workspace managed with Turborepo.

Main applications:

- `apps/client-app`: React Native app built with React 19 and TypeScript
- `apps/server`: NestJS server built with TypeScript

Shared packages:

- `packages/contracts`: contract-first endpoint definitions, request and response schemas, and shared HTTP code conventions
- `packages/api`: shared Axios-based API client with auth refresh support
- `packages/types`: shared TypeScript types
- `packages/access-control`: shared permission and bitmap helpers
- `packages/configs`: shared lint and config helpers

Core tooling and libraries:

- TypeScript across the entire monorepo
- ESLint + Prettier for formatting and linting
- Turborepo for task orchestration
- Zod for runtime schema validation
- Tailwind CSS v4 + Uniwind in the React Native app
- React Navigation, React Query, Redux Toolkit, and React Hook Form in the app
- NestJS, Prisma, and Jest in the server

## Workspace Expectations

- Prefer editing existing files and patterns over introducing new abstractions too early.
- Reuse existing shared packages before creating new app-local or server-local types.
- Keep naming in `kebab-case` for newly created files and directories unless a platform convention requires otherwise.
- In `camelCase` identifiers, lowercase the full acronym when it appears first, for example `jwtPayload`.
- In `PascalCase` type names, keep the acronym uppercase when that improves semantics, for example `JWTPayload`.
- Do not manually edit generated artifacts such as `dist/**`, `.turbo/**`, or `apps/server/src/generated/prisma/**`.
- Treat `packages/contracts` as the source of truth for endpoint contracts and shared HTTP semantics.

## UI And Screen Implementation

- Reuse existing base components before creating new ones.
- Prefer composing screens from existing primitives in `src/components/common` and feature-local components in the relevant screen folder.
- Keep screen-specific UI inside the relevant feature or screen directory instead of promoting it to `common` too early.
- For new screens, prefer a structure like:
  - `screen-folder/index.tsx`
  - `screen-folder/components/*`
  - `screen-folder/hooks/*` when local hooks are needed
- Prefer small presentational components and move data loading, mutations, and orchestration into hooks or service modules.

## Styling

- Use Tailwind `className` strings for styling.
- Unless a value is inherently runtime-only, avoid inline `style`.
- Avoid arbitrary values such as `w-[123px]`. If a value is reused or clearly belongs to the design system, move it into `src/global.css` or a shared styling utility.
- Prefer existing theme tokens such as `bg-background`, `text-foreground`, `text-foreground-secondary`, `bg-background-secondary`, and brand colors already defined in `src/global.css`.
- When a third-party component requires inline style or a direct prop-based color, derive the value from the existing theme tokens instead of inventing a new raw color.
- Keep light and dark theme behavior aligned with the tokens defined in `apps/client-app/src/global.css`.

## Text And Layout Primitives

- Prefer `ScreenWrapper` as the outermost wrapper for new app screens.
- Prefer `ThemeText` for normal application text so foreground color stays consistent with the current theme.
- Prefer `ThemeTextInput` instead of raw `TextInput` when the input should follow app defaults.
- If a component needs an icon, import the needed icon set directly from `@react-native-vector-icons/*`. Do not add new icon wrapper layers.

## Types, Contracts, And Schemas

- Prefer deriving request and response types from `packages/contracts` instead of redefining local API types.
- Add or update Zod schemas in `packages/contracts` first when changing an API contract.
- Keep request and response validation close to the contract definition.
- Prefer schema-backed parsing over unchecked casting.
- On the app side, use contract exports such as endpoint definitions and request or response types directly.
- On the server side, align controller handlers and use cases with the corresponding contract endpoint.
- Use `Request` only for endpoint-level input payloads.
- Use `Response` only for endpoint-level output payloads.
- Do not force `Request` or `Response` onto reusable nested structures such as `AuthTokens` or `SessionUser`.
- Use `View` for shapes already adapted for frontend consumption.
- Use `Summary` for intentionally partial nested structures.
- Keep schema names and inferred type names aligned, for example `SignInRequestSchema` -> `SignInRequest`.
- Do not give a Zod schema constant and its inferred TypeScript type the same name.
- Keep endpoint-specific transport semantics such as `nullable()` in `endpoints.ts` where practical, instead of baking them into the base model schema.
- Organize contracts by domain first.
- Prefer domain entrypoints such as `@postsop/contracts/auth` over broad shared barrels in new code.

Example:

```ts
import type { SignInRequest } from '@postsop/contracts/auth'
import { signInEndpoint } from '@postsop/contracts/auth'
```

Prefer:

```ts
export const SignInRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type SignInRequest = z.infer<typeof SignInRequestSchema>
```

## Service Layer And React Query Conventions

- Keep raw network calls in `src/services/**/request.ts`.
- Keep React Query hooks in `src/services/**/queries.ts` and `src/services/**/mutations.ts`.
- Keep query keys in `src/services/**/keys.ts`.
- Prefer `requestEndpoint(endpoint, { data, params })` over manually rebuilding endpoint URLs.
- Let React Query own fetching, caching, invalidation, and retry behavior.
- Prefer invalidating specific query keys after successful mutations rather than manually mutating unrelated cache entries.
- Use `meta.skipGlobalErrorHandler` only when the request has a deliberate local error strategy.
- Global request behavior already exists in `apps/client-app/src/libs/query-client/index.tsx`; do not duplicate toast or retry behavior without a clear reason.

Example:

```ts
export function useProfileQuery() {
  return useQuery({
    queryKey: userKey.profile(),
    queryFn: requestProfile,
  })
}
```

## API Client And Error Handling

- Use the shared client in `apps/client-app/src/api`.
- Prefer endpoint-based calls over ad hoc Axios calls.
- Treat `ApiError` as the normalized client-side error type for server and transport failures.
- When handling auth-related failures, use the helpers already available on `ApiError` such as `isUnauthorized`, `isTokenExpired`, and `needsRefresh`.
- Do not assume every failed request throws a plain `Error`.

## Server Conventions

- Keep controller methods thin. Controllers should mainly map contract endpoints to use-case or service calls.
- Prefer business logic in use-case classes or dedicated services, not controllers.
- Reuse existing server patterns:
  - controllers under `modules/**/controllers`
  - use cases under `modules/**/use-cases`
  - query services under `modules/**/queries`
  - mappers and selectors where shaping or projection logic matters
- Use `AppException` for expected business failures.
- Do not return ad hoc error objects from controllers or services.
- Keep server responses aligned with the global response pipeline in `main.ts`.

## Permission Mirror Rules

- `@postsop/access-control` is the only source of truth for permission semantics.
- The database `permissions` table is a mirror used for assignment and relational queries.
- Do not manually create, update, or delete rows in `permissions`.
- If emergency manual repair is unavoidable, run `pnpm server:db:permissions:check` afterward.
- A permission that is still referenced by roles must not be removed from the mirror until those bindings are cleared.

Recommended deployment order:

1. `pnpm server:db:migrate`
2. `pnpm server:db:permissions:sync`
3. Start the server

When adding a permission:

1. Add it to `packages/access-control/src/permissions.ts`
2. Run `pnpm server:db:permissions:sync`
3. Assign it to roles

When deprecating a permission:

1. Keep the permission in code and set `deprecated: true`
2. Run `pnpm server:db:permissions:sync`
3. Stop assigning it to new roles
4. Remove all existing role bindings
5. Delete the permission from code
6. Run `pnpm server:db:permissions:sync` again

## HTTP Response Rules

- The only successful API state is `httpStatus === 200 && code === Codes.SUCCESS`.
- Non-success business codes must never be returned with HTTP 200 or any other 2xx status.
- Use `AppException` for expected failures and let the global exception filter serialize them.
- Do not manually wrap controller return values with success or failure envelopes. The global interceptor and exception filter already do that.
- If a new failure case is introduced, make sure both the business code and HTTP status are mapped correctly.

## Forms And Validation

- Prefer React Hook Form for non-trivial forms.
- Keep field-level UI inside reusable form components when possible.
- Run validation through Zod-backed schemas or other existing schema-driven flows instead of scattered manual checks.
- Prefer surfacing user-facing validation messages close to the field when appropriate.

## State Management

- Prefer React Query for server state.
- Prefer Redux Toolkit only for app-level client state that is not just fetched server data.
- Keep persisted auth or theme state in the existing storage and session utilities instead of introducing a parallel persistence path.

## Imports And Module Boundaries

- In the client app, prefer the `@/*` alias for imports from `src/*`.
- Keep imports consistent with the existing lint and formatter setup.
- Prefer importing from a feature-local file directly when that improves clarity.
- Use barrel exports only where the repository already relies on them and they remain easy to navigate.
- Avoid circular imports, especially between shared UI primitives, hooks, and services.

## Formatting And Linting

- Follow Prettier defaults in this repository: no semicolons, single quotes, trailing commas where supported.
- Let the formatter and ESLint decide import ordering and Tailwind class sorting.
- Do not manually reformat unrelated files.
- Keep changes narrow and task-focused.

Useful commands:

```sh
pnpm lint
pnpm type-check
pnpm --filter @postsop/client-app type-check
pnpm --filter @postsop/server type-check
pnpm --filter @postsop/server test
```

## Testing And Verification

- Prefer validating the smallest relevant scope first.
- For app-only changes, usually start with `pnpm --filter @postsop/client-app type-check`.
- For server-only changes, usually start with `pnpm --filter @postsop/server type-check` and the most relevant Jest tests.
- Add or update tests when changing behavior, especially around server response semantics, auth flows, contract behavior, and shared utilities.
- If a bug fix depends on a specific invariant, add a focused test for that invariant when practical.

## Documentation Expectations

- Update nearby documentation when behavior or architecture changes in a way that future contributors would reasonably miss.
- If a recurring convention caused confusion during the task, document it here.
- Keep documentation practical, specific to this repository, and easy for an AI agent to act on.
