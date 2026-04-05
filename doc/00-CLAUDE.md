# SaaS Project: React 19 + Mantine v7 Standards

## Tech Stack
- **Framework:** React 19 (Vite)
- **UI Library:** Mantine UI v7 (PostCSS-based)
- **Language:** TypeScript (Strict Mode)
- **Testing:** Playwright (E2E)

## UI & Styling Rules
- **Core Components:** Use `@mantine/core` for all UI elements.
- **Styling:** Strictly NO inline styles. Use Mantine CSS modules or the Styles API.
- **Theme:** Support Light/Dark mode via `useMantineColorScheme`.
- **Layout:** Every page MUST be wrapped in the `AppShell` component.
- **Icons:** Use `@tabler/icons-react`.

## Development Patterns
- **React 19:** Use `useActionState` and `useOptimistic` for form handling.
- **State Management:** Prefer native React hooks or `Zustand` if global state is needed.
- **Forms:** Use `@mantine/form` combined with React 19 Actions.
- **Testing:** All new features must include a Playwright `.spec.ts` file.

## Commands
- **Install:** `npm install`
- **Dev:** `npm run dev`
- **Build:** `npm run build`
- **Test:** `npx playwright test`
- **Lint:** `npm run lint`