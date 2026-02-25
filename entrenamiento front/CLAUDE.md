# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 boilerplate application with Redux Toolkit for state management, Redux Saga for side effects, and next-intl for internationalization. The project uses TypeScript, Sass for styling, and enforces code quality through ESLint, Prettier, Commitlint, and Husky hooks.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture Overview

### State Management (Redux + Saga)

The application uses a Redux store with Redux Saga for async operations:

- **Store configuration**: `src/store/index.ts` configures the store with redux-persist (client-side only), Redux Saga middleware, and handles SSR hydration using `next-redux-wrapper`
- **Store structure**: Each feature has its own directory under `src/store/` (e.g., `src/store/counter/`)
- **Feature modules**: Each store module contains:
  - `action-types.ts` - Action type constants
  - `action.ts` - Redux Toolkit action creators
  - `reducer.ts` - Redux Toolkit slice/reducer
  - `saga.ts` - Redux Saga watchers and workers for async operations
- **Root files**:
  - `src/store/reducers.ts` - Combines all feature reducers
  - `src/store/sagas.ts` - Forks all feature sagas
  - `src/store/provider.tsx` - Redux Provider wrapper component
  - `src/store/selectors.ts` - Global selector utilities

### Internationalization (i18n)

The app uses `next-intl` for internationalization with locale-based routing:

- **Configuration**: `src/i18n/routing.ts` defines supported locales (`en`, `es`) and routing behavior
- **Request config**: `src/i18n/request.ts` loads locale-specific messages
- **Translation files**: `src/i18n/messages/{locale}.json` contain translations
- **Middleware**: `src/middleware.ts` handles locale detection and routing
- **Routing structure**: All routes are under `src/app/[locale]/` for locale-specific paths
- **Navigation**: Use exported navigation utilities from `src/i18n/routing.ts` (`Link`, `redirect`, `usePathname`, `useRouter`) instead of Next.js defaults to maintain locale awareness

### Project Structure

```
src/
├── app/[locale]/          # Next.js App Router with locale-based routing
│   ├── layout.tsx         # Root layout with Redux and i18n providers
│   └── page.tsx           # Home page
├── components/            # Reusable React components (presentational)
├── screens/               # Screen/page-level components (container components)
├── store/                 # Redux store, reducers, actions, and sagas
├── i18n/                  # Internationalization configuration and messages
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions and helpers
├── styles/                # Global styles and Sass modules
└── middleware.ts          # Next.js middleware for i18n routing
```

### Component Organization

- **Components** (`src/components/`): Reusable, presentational components (e.g., buttons, inputs)
- **Screens** (`src/screens/`): Container components that connect to Redux and compose other components for specific pages
- **Styling**: Use Sass modules (`.module.scss`) co-located with components

### Path Aliases

- `@/*` maps to `src/*` (configured in `tsconfig.json`)
- Example: `import { store } from '@/store'`

## Code Quality

### Prettier Configuration

- Print width: 120 characters
- Tab width: 2 spaces
- Single quotes for strings
- Trailing commas (ES5)
- Line endings: LF

### ESLint Rules

- Extends Next.js recommended config with TypeScript and Prettier
- `@typescript-eslint/no-explicit-any`: warn (not error)
- `@typescript-eslint/no-unused-vars`: warn
- TypeScript comments (`@ts-expect-error`, `@ts-ignore`) allowed with descriptions
- CommonJS `require` is allowed (for Next.js config files)

### Git Hooks (Husky)

- **pre-commit**: Runs `lint-staged` to format staged `.md` and `.json` files with Prettier
- **commit-msg**: Enforces conventional commit format using commitlint

### Commit Message Format

Follow conventional commits specification (enforced by commitlint):

- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance tasks
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `style:` - Code style changes

## Adding New Features

When adding a new Redux feature (e.g., "auth"):

1. Create `src/store/{feature}/` directory with:
   - `action-types.ts` - Define action constants
   - `action.ts` - Create action creators with `createAction`
   - `reducer.ts` - Create slice with `createSlice` or reducer
   - `saga.ts` - Define saga watchers and workers for async logic
2. Register in `src/store/reducers.ts` using `combineReducers`
3. Register sagas in `src/store/sagas.ts` by forking watchers
4. Add to redux-persist whitelist in `src/store/index.ts` if state should persist

## Key Dependencies

- **Next.js 14**: React framework with App Router
- **Redux Toolkit**: State management with simplified Redux patterns
- **Redux Saga**: Side effects management
- **redux-persist**: Persist Redux state to localStorage (client-side only)
- **next-intl**: Internationalization with locale-based routing
- **Sass**: CSS preprocessor
- **Axios**: HTTP client (available for API calls)

## Requirements

- Node.js >= 20.x
- npm >= 10.x
