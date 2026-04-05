# Repository Guidelines

This repository contains the documentation blueprint for a React + Mantine UI SaaS app. Use the guides here to scaffold and implement the app in a separate project folder.

## Project Structure & Module Organization

- Docs live at the repo root as numbered guides (for example, `00-GETTING-STARTED.md` through `07-QUICK-REFERENCE.md`).
- The recommended application layout (from `00-GETTING-STARTED.md`) is:
  - `src/components/` for UI pieces (`auth/`, `dashboard/`, `layout/`, `common/`).
  - `src/pages/` for route-level screens.
  - `src/hooks/`, `src/contexts/`, `src/services/`, `src/utils/`, `src/styles/` for shared logic.

## Build, Test, and Development Commands

Use these commands in the generated app (see `01-SETUP-CONFIGURATION.md`):

- `npm run dev`: start the Vite dev server.
- `npm run build`: type-check and build for production.
- `npm run preview`: serve the production build locally.
- `npm run lint`: run ESLint across `.ts` and `.tsx`.
- `npm run type-check`: run `tsc --noEmit`.

## Coding Style & Naming Conventions

- Indentation: 2 spaces in TypeScript/TSX and JSON (matches examples in setup docs).
- Components: `PascalCase` file/component names (for example, `LoginPage.tsx`).
- Hooks: `useSomething` naming for React hooks.
- Docs: keep the numeric prefix pattern (for example, `08-NEW-TOPIC.md`).

## Testing Guidelines

- Recommended stack: Vitest + Testing Library (`06-BEST-PRACTICES.md`).
- Add global setup at `src/test/setup.ts` and wrap component tests in `TestWrapper`.
- Suggested naming: `*.test.tsx` for UI tests.

## Commit & Pull Request Guidelines

- No Git history is present in this repo, so no existing commit convention can be inferred.
- If you add history, prefer Conventional Commits (for example, `feat: add auth docs`).
- PRs should include: a short summary, affected docs/paths, and screenshots if UI examples change.

## Security & Configuration Tips

- Never commit secrets; use `.env` and a checked-in `.env.example`.
- Read `06-BEST-PRACTICES.md` before adding production guidance.
