# Shared Package Template

Use `@postsop/shared-contracts` as the reference package for new internal shared packages.

## Directory Shape

```text
packages/shared/<package-name>/
  package.json
  tsconfig.json
  tsconfig.build.json
  src/
    index.ts
    <feature>/
```

## Export Strategy

- Keep the public API rooted at `src/index.ts`.
- Re-export feature modules from `src/index.ts`.
- Point `types` to source so TypeScript consumers read the latest contracts without waiting for a rebuild.
- Point `react-native` to source so Metro can bundle workspace TypeScript directly.
- Point `require` and `default` to `dist` so Node runtime consumers still execute compiled JavaScript.

```json
{
  "main": "./dist/index.js",
  "types": "./src/index.ts",
  "react-native": "./src/index.ts",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "react-native": "./src/index.ts",
      "require": "./dist/index.js",
      "default": "./dist/index.js"
    }
  }
}
```

## Recommended Scripts

```json
{
  "scripts": {
    "lint": "pnpm --dir ../../.. exec eslint packages/shared/<package-name> --cache",
    "lint:fix": "pnpm --dir ../../.. exec eslint packages/shared/<package-name> --fix --cache",
    "clean": "node -e \"require('node:fs').rmSync('dist', { recursive: true, force: true })\"",
    "build": "pnpm run clean && tsc -p tsconfig.build.json",
    "build:watch": "tsc -p tsconfig.build.json --watch",
    "type-check": "tsc -p tsconfig.json --noEmit"
  }
}
```

## Resolution Rules

- `mobile` resolves runtime source through the `react-native` export condition.
- `tsc` resolves package types through the `types` export condition.
- `server` runtime resolves compiled JavaScript through `require` or `default`.

## Turbo Commands

```sh
pnpm build
pnpm lint
pnpm type-check
pnpm test
pnpm contracts:watch
```
