# Permission Mirror

`@postsop/access-control` is the only source of truth for permission semantics.
The database `permissions` table is a mirror used for role assignment and relational
queries.

## Commands

- `pnpm server:db:permissions:check`
- `pnpm server:db:permissions:sync`

Recommended deployment order:

1. `pnpm server:db:migrate`
2. `pnpm server:db:permissions:sync`
3. Start the server

## Lifecycle

### Add a permission

1. Add the permission to `packages/access-control/src/permissions.ts`
2. Run `pnpm server:db:permissions:sync`
3. Assign it to roles

### Deprecate a permission

1. Keep the permission in code and set `deprecated: true`
2. Run `pnpm server:db:permissions:sync`
3. Stop assigning it to new roles
4. Remove all existing role bindings
5. Delete the permission from code
6. Run `pnpm server:db:permissions:sync` again

## Rules

- Do not manually create, update, or delete rows in `permissions`
- If an emergency manual repair is unavoidable, run `pnpm server:db:permissions:check` afterward
- A permission still referenced by roles cannot be removed from the mirror until the role bindings are cleared
