# Contracts Naming

This document defines naming rules for `@postsop/contracts`.

## Purpose

The goal is to keep three things clear:

- which type is an endpoint-level request payload
- which type is an endpoint-level response payload
- which type is only a reusable nested structure

The rule is semantic first, not suffix first.

## Rules

1. Use `Request` only for endpoint-level input payloads.

- `SignInRequest`
- `SignUpRequest`
- `RefreshRequest`

2. Use `Response` only for endpoint-level output payloads.

- `SignInResponse`
- `RefreshTokenResponse`

3. Do not force `Request` or `Response` onto reusable nested structures.

- `AuthTokens`
- `SessionUser`
- `RoleSummary`

These types may appear inside a response, but they are not a full response by themselves.

4. Use `View` for presentation-oriented models returned to the client.

- `UserProfileView`

Use `View` when the shape is already adapted for frontend consumption and is not a direct persistence model.

5. Use `Summary` for reduced nested structures.

- `RoleSummary`

Use `Summary` when the type is intentionally partial and is usually embedded in a larger payload.

6. Keep schema and inferred type names aligned.

- `SignInRequestSchema` -> `SignInRequest`
- `SignInResponseSchema` -> `SignInResponse`
- `UserProfileViewSchema` -> `UserProfileView`

7. Do not give the Zod schema constant and inferred TypeScript type the same name.

Avoid:

```ts
export const SignInSchema = z.object(...)
export type SignInSchema = z.infer<typeof SignInSchema>
```

Prefer:

```ts
export const SignInRequestSchema = z.object(...)
export type SignInRequest = z.infer<typeof SignInRequestSchema>
```

8. Keep interface semantics in `endpoints.ts`, not in the base model when possible.

Good example:

```ts
responseSchema: UserProfileViewSchema.nullable()
```

`nullable()` here describes the endpoint contract, not the base `UserProfileView` model itself.

9. Keep contracts organized by domain first.

Example:

```text
packages/contracts/src/
  core/
  modules/
    auth/
    user/
```

Within a domain, prefer:

- `endpoints.ts`
- `request-schemas.ts`
- `response-schemas.ts`

10. Prefer domain entrypoints over broad shared barrels in new code.

Prefer:

```ts
import { authEndpoints, type SignInRequest } from '@postsop/contracts/auth'
import { userEndpoints, type UserProfileView } from '@postsop/contracts/user'
```

Avoid using broad imports like `@postsop/contracts/schemas` in new code unless compatibility is needed.

## Decision Guide

If a type represents the full payload of one endpoint, use `Request` or `Response`.

If a type is a reusable building block inside another payload, use a business name without forcing a transport suffix.

If a type is shaped for UI consumption, use `View`.

If a type is intentionally partial, use `Summary`.

## Current Examples

- [packages/contracts/src/modules/auth/request-schemas.ts](../packages/contracts/src/modules/auth/request-schemas.ts)
- [packages/contracts/src/modules/auth/response-schemas.ts](../packages/contracts/src/modules/auth/response-schemas.ts)
- [packages/contracts/src/modules/auth/endpoints.ts](../packages/contracts/src/modules/auth/endpoints.ts)
- [packages/contracts/src/modules/user/response-schemas.ts](../packages/contracts/src/modules/user/response-schemas.ts)
- [packages/contracts/src/core/endpoints.ts](../packages/contracts/src/core/endpoints.ts)
- [packages/contracts/src/core/http.ts](../packages/contracts/src/core/http.ts)
