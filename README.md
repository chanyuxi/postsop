# postsop

Monorepo for the `postsop` React Native client app and NestJS server.

For repository-specific engineering conventions and AI collaboration guidance, see [AGENTS.md](./AGENTS.md).

## Tech Stack

### Workspace

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo](https://turbo.build/repo/docs)
- [TypeScript](https://www.typescriptlang.org/)
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [Prettier](https://prettier.io/)
- [Husky](https://typicode.github.io/husky/)
- [commitlint](https://commitlint.js.org/)

### Client App

- [React Native](https://reactnative.dev/docs/getting-started)
- [React](https://react.dev/)
- [Uniwind](https://docs.uniwind.dev/quickstart)
- [Tailwind CSS v4](https://tailwindcss.com/docs/installation/tailwind-cli)
- [tailwind-variants](https://www.tailwind-variants.org/docs/introduction)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- [@react-native-vector-icons/material-design-icons](https://oblador.github.io/react-native-vector-icons/#MaterialDesignIcons)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [@tanstack/react-query](https://tanstack.com/query/latest)
- [@reduxjs/toolkit](https://redux-toolkit.js.org/)
- [react-hook-form](https://react-hook-form.com/)
- [axios](https://axios-http.com/)
- [zod](https://zod.dev/)

### Server

- [NestJS](https://docs.nestjs.com/)
- [Prisma](https://www.prisma.io/docs)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Jest](https://jestjs.io/)
- [zod](https://zod.dev/)

### Shared Packages

- `@postsop/contracts`: contract-first endpoint definitions and HTTP semantics
- `@postsop/api`: shared API client with auth refresh support
- `@postsop/types`: shared TypeScript types
- `@postsop/access-control`: permission and bitmap helpers
- `@postsop/configs`: shared lint and config presets

## Environment

- Node.js `>= 22.11.0`
- `pnpm@10`
- A local React Native development environment for `apps/client-app`
  Follow the official setup guide for Android Studio, Xcode, and SDKs:
  https://reactnative.dev/docs/set-up-your-environment
- PostgreSQL for `apps/server`
- Redis for `apps/server`

Environment files:

- Client app reference: `apps/client-app/.env.example`
- Server reference: `apps/server/.env.example`

## Quick Start

1. Install dependencies

```bash
pnpm install
```

2. Configure environment variables

- Copy `apps/client-app/.env.example` and fill in `REACT_APP_API_URL` and `REACT_APP_API_TIMEOUT`
- Copy `apps/server/.env.example` and fill in database, Redis, JWT, and port settings

3. Start the server

```bash
pnpm server:dev
```

4. Start Metro for the client app

```bash
pnpm client-app:start
```

5. Run the client app

```bash
pnpm client-app:android
```

```bash
pnpm client-app:ios
```

6. Optional: watch shared contracts while working across packages

```bash
pnpm contracts:watch
```

## Scripts

### Workspace Scripts

| Command                            | Description                               |
| ---------------------------------- | ----------------------------------------- |
| `pnpm build`                       | Run build tasks across the workspace      |
| `pnpm dev`                         | Run workspace development tasks           |
| `pnpm lint`                        | Run lint tasks across the workspace       |
| `pnpm lint:fix`                    | Auto-fix root-level lint issues           |
| `pnpm test`                        | Run test tasks across the workspace       |
| `pnpm type-check`                  | Run type-check tasks across the workspace |
| `pnpm contracts:watch`             | Watch and rebuild `@postsop/contracts`    |
| `pnpm client-app:start`            | Start Metro for the client app            |
| `pnpm client-app:android`          | Run the Android app                       |
| `pnpm client-app:ios`              | Run the iOS app                           |
| `pnpm server:dev`                  | Start the server in watch mode            |
| `pnpm server:build`                | Build the server                          |
| `pnpm server:test`                 | Run server unit tests                     |
| `pnpm server:type-check`           | Run the server TypeScript checker         |
| `pnpm server:db:generate`          | Generate Prisma client                    |
| `pnpm server:db:migrate`           | Run Prisma migrations                     |
| `pnpm server:db:seed`              | Seed the database                         |
| `pnpm server:db:studio`            | Open Prisma Studio                        |
| `pnpm server:db:permissions:check` | Check permission registry consistency     |
| `pnpm server:db:permissions:sync`  | Sync permission registry data             |

### Client App Scripts

| Command                                            | Description                         |
| -------------------------------------------------- | ----------------------------------- |
| `pnpm --filter @postsop/client-app start`          | Start Metro                         |
| `pnpm --filter @postsop/client-app android`        | Run the Android app                 |
| `pnpm --filter @postsop/client-app ios`            | Run the iOS app                     |
| `pnpm --filter @postsop/client-app lint`           | Run ESLint for the client app       |
| `pnpm --filter @postsop/client-app lint:fix`       | Auto-fix client app lint issues     |
| `pnpm --filter @postsop/client-app type-check`     | Run the client app TypeScript check |
| `pnpm --filter @postsop/client-app test`           | Run client app tests                |
| `pnpm --filter @postsop/client-app tailwind:build` | Build the generated Tailwind output |

### Server Scripts

| Command                                          | Description                     |
| ------------------------------------------------ | ------------------------------- |
| `pnpm --filter @postsop/server dev`              | Start the server in watch mode  |
| `pnpm --filter @postsop/server build`            | Build the server                |
| `pnpm --filter @postsop/server start`            | Start the built server          |
| `pnpm --filter @postsop/server lint`             | Run ESLint for the server       |
| `pnpm --filter @postsop/server lint:fix`         | Auto-fix server lint issues     |
| `pnpm --filter @postsop/server type-check`       | Run the server TypeScript check |
| `pnpm --filter @postsop/server test`             | Run server unit tests           |
| `pnpm --filter @postsop/server test:e2e`         | Run server end-to-end tests     |
| `pnpm --filter @postsop/server db:generate`      | Generate Prisma client          |
| `pnpm --filter @postsop/server db:migrate`       | Run Prisma migrations           |
| `pnpm --filter @postsop/server db:seed`          | Seed the database               |
| `pnpm --filter @postsop/server db:studio`        | Open Prisma Studio              |
| `pnpm --filter @postsop/server db:permissions:*` | Check or sync permission data   |

## Project Structure

### Workspace Structure

| Path                      | Description                                        |
| ------------------------- | -------------------------------------------------- |
| `apps/client-app`         | React Native mobile app                            |
| `apps/server`             | NestJS backend server                              |
| `packages/api`            | Shared API client                                  |
| `packages/contracts`      | Shared endpoint contracts, schemas, and HTTP types |
| `packages/types`          | Shared TypeScript types                            |
| `packages/access-control` | Shared permission helpers                          |
| `packages/configs`        | Shared config presets                              |
| `AGENTS.md`               | Repository guidance for AI-assisted work           |

### Client App Structure

| Path                                     | Description                               |
| ---------------------------------------- | ----------------------------------------- |
| `apps/client-app/src/api`                | API client setup and request entry points |
| `apps/client-app/src/assets`             | Static resources                          |
| `apps/client-app/src/components`         | Shared and feature UI components          |
| `apps/client-app/src/constants`          | App constants                             |
| `apps/client-app/src/hooks`              | Shared hooks                              |
| `apps/client-app/src/libs`               | App infrastructure helpers                |
| `apps/client-app/src/routes`             | Navigation configuration                  |
| `apps/client-app/src/screens`            | Screen-level features                     |
| `apps/client-app/src/services`           | Service layer and React Query helpers     |
| `apps/client-app/src/store`              | Redux store and feature slices            |
| `apps/client-app/src/types`              | App-local types                           |
| `apps/client-app/src/utils`              | Utility functions                         |
| `apps/client-app/src/global.css`         | Tailwind and theme token definitions      |
| `apps/client-app/src/data-deperated`     | Legacy data helpers slated for cleanup    |
| `apps/client-app/src/services-deperated` | Legacy services slated for cleanup        |

### Server Structure

| Path                       | Description                                   |
| -------------------------- | --------------------------------------------- |
| `apps/server/src/common`   | Shared decorators, filters, guards, and utils |
| `apps/server/src/config`   | App configuration modules                     |
| `apps/server/src/cache`    | Cache and Redis setup                         |
| `apps/server/src/database` | Database infrastructure                       |
| `apps/server/src/modules`  | Feature modules, controllers, and use cases   |
| `apps/server/src/types`    | Server-local types                            |
| `apps/server/prisma`       | Prisma schema, migrations, and seed scripts   |
| `apps/server/test/unit`    | Unit tests                                    |
| `apps/server/test/e2e`     | End-to-end tests                              |

## Team Conventions

### Code Style

- ESLint Flat Config is used across the monorepo
- Prettier is used for formatting with the current rules:
  single quotes, no semicolons, ES5 trailing commas, and one JSX prop per line
- Tailwind class sorting is handled by `prettier-plugin-tailwindcss`
- Prefer `kebab-case` for newly created files and directories unless platform tooling requires otherwise

### Client App

- Prefer `className`-based Tailwind styling over inline `style`
- Prefer existing primitives such as `ScreenWrapper`, `ThemeText`, and `ThemeTextInput`
- Import icon sets directly from `@react-native-vector-icons/*` instead of adding wrapper layers
- Keep raw network calls in `src/services/**/request.ts`
- Keep React Query hooks in `src/services/**/queries.ts` and `src/services/**/mutations.ts`
- Prefer shared contracts from `@postsop/contracts` over redefining API types locally

### Server

- Keep controllers thin and move business logic into use-case or service classes
- Use shared contract endpoints from `@postsop/contracts` in controller decorators and request parsing
- Use `AppException` for expected business failures
- The only successful API response is `httpStatus = 200` and `code = Codes.SUCCESS`
- Non-success business codes must never be returned with HTTP 200 or any other 2xx status

### Imports And Configuration Files

- Keep imports sorted according to the existing lint rules
- Prefer the `@/*` alias inside the client app and server where configured
- Do not casually reorder `package.json`, `tsconfig*.json`, or other structured config files
- Prefer updating shared packages instead of duplicating types or API semantics inside an app

### Git Hooks

- `pre-commit` runs `lint-staged`
- markdown, json, yml, and yaml files are formatted before commit
- commit messages are validated with commitlint
- run type-check and relevant tests manually before pushing when the change is non-trivial

## Commit Message

This repository uses [Conventional Commits](https://www.conventionalcommits.org/).

```text
<type>[optional scope]: <description>
```

### Allowed Types

| Type       | Description                                                                    |
| ---------- | ------------------------------------------------------------------------------ |
| `feat`     | A new feature                                                                  |
| `fix`      | A bug fix                                                                      |
| `docs`     | Documentation-only changes                                                     |
| `style`    | Style or formatting changes with no logic impact                               |
| `refactor` | A code change that improves structure without adding a feature or fixing a bug |
| `test`     | Added or corrected tests                                                       |
| `chore`    | Build, tooling, or dependency maintenance                                      |
| `revert`   | Revert a previous commit                                                       |

### Examples

```text
feat(auth): add refresh token rotation
fix(server): ensure non-success responses never return 200
docs(readme): rewrite workspace onboarding guide
```

## Recommended Workflow

Before committing or pushing, it is recommended to run at least:

```bash
pnpm lint
pnpm type-check
pnpm test
```

For focused work, prefer the smallest relevant validation scope:

```bash
pnpm --filter @postsop/client-app type-check
pnpm --filter @postsop/server type-check
pnpm --filter @postsop/server test
```
