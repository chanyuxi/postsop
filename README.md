# postsop

Monorepo root for the `postsop` React Native app and backend, managed with `pnpm` workspaces and Turborepo.

## Common Commands

```sh
pnpm build
pnpm lint
pnpm type-check
pnpm test
pnpm contracts:watch
```

For package-specific work, prefer `pnpm --filter @postsop/mobile <script>` or `pnpm --filter @postsop/backend <script>`.

## Shared Packages

- `@postsop/contracts` is the reference implementation for new shared packages.
