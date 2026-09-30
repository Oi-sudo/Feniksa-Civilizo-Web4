# Feniksa Civilizo Web4 0.1 Alpha — Runtime Handoff

This branch was created as a safe integration branch for the Web4 0.1 Alpha runtime package.

## Current status

- Source package prepared and preserved outside the production branch.
- Main branch remains untouched.
- Runtime verification is not yet claimed.
- The next required step is to place the Alpha source package into this branch, then run the prepared runtime workflow against Node.js 22 and PostgreSQL 17.

## Verification gate

The release may be renamed **Runtime Verified** only after all of the following succeed:

1. install dependencies
2. run all 17 database migrations
3. load seed data
4. verify required roles, nine museum halls, and AI/SI system terms
5. TypeScript check
6. production build
7. production server start
8. /api/health returns healthy
9. registration/login
10. course progress persistence
11. EST approval flow
12. BUD approval flow
13. museum browsing and review workflow
14. DAD proposal/discussion/voting
15. project execution flow
16. audit-log verification

## Safety

Do not merge this branch into main until the runtime verification gate is green.
