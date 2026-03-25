# `@postsop/shared-contracts`

Internal shared contract package for the workspace.

## Public API

- Keep the public surface rooted at `src/index.ts`.
- Organize source files under feature folders like `src/definition/*`.
- Re-export anything intended for apps or services through `src/index.ts`.

## Resolution Strategy

- TypeScript reads source through the `types` export, so app and server type-checks see the latest contracts without waiting for a rebuild.
- React Native reads source through the `react-native` export, so Metro can bundle workspace source directly.
- Node runtime reads `dist`, so server builds still execute compiled JavaScript.

## Commands

```sh
pnpm --filter @postsop/shared-contracts build
pnpm --filter @postsop/shared-contracts build:watch
pnpm --filter @postsop/shared-contracts type-check
```
