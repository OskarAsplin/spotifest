# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build and Development

- `yarn start` - Start development server on port 3000 (Vite)
- `yarn build` - Build for production (runs TypeScript check + Vite build)
- `yarn preview` - Preview production build on port 3000

### Code Quality

- `yarn lint` - Run ESLint on all source files
- `yarn lint:fix` - Run ESLint with auto-fix
- `yarn format` - Format code with Prettier

### Testing and Analysis

- `yarn find-circular-dependencies` - Check for circular dependencies using Madge
- `yarn find-unused-exports` - Find unused exports with ts-prune
- `yarn find-dead-code` - Find dead code (unused exports not used in modules)

### Storybook

- `yarn storybook` - Start Storybook development server on port 6006
- `yarn build-storybook` - Build Storybook for production

## Architecture Overview

### Core Technologies

- **React 19** with TypeScript and Vite
- **TanStack Router** for file-based routing with type safety
- **TanStack Query** for server state management
- **Zustand** for client state management
- **Material-UI (MUI)** for component library
- **Tailwind CSS** for styling

### Project Structure

The app follows atomic design principles with a clear separation of concerns:

- `src/components/` - Atomic design structure (atoms, molecules, organisms, templates)
- `src/pages/` - Page components
- `src/routes/` - TanStack Router route definitions
- `src/api/` - API layer with combined Django/Spotify integrations
- `src/zustand/` - Global state stores
- `src/utils/` - Utility functions
- `src/translations/` - i18n localization

### Key Architectural Patterns

#### API Layer

- **Combined API approach**: Uses both Django backend and Spotify Web API
- **Fallback strategy**: Falls back to Spotify API when Django API fails
- **React Query integration**: All API calls wrapped with React Query for caching and error handling
- **Type safety**: Full TypeScript coverage for API responses

#### State Management

- **Zustand stores** for global state:
  - `authStore` - Spotify authentication (persisted)
  - `matchingStore` - Festival matching criteria (persisted)
  - `themeStore` - Theme preferences
  - `sharedResultsStore` - Shared results data

#### Routing

- **File-based routing** with TanStack Router
- **Layout routes**: `_withLayout` and `_withProtectedLayout` for shared layouts
- **Type-safe navigation** with generated route tree

#### Component Organization

- **Atomic Design**: Components organized by complexity (atoms → molecules → organisms → templates)
- **Container pattern**: Separate containers for business logic
- **Storybook documentation**: All components have stories for documentation

### Key Features

- **Festival matching**: Matches user's Spotify data with festival lineups
- **Spotify OAuth**: PKCE flow for secure authentication
- **Social sharing**: Share festival matches on social media
- **Responsive design**: Mobile-first approach with MUI theming
- **Internationalization**: i18next setup for multiple languages

### Development Notes

- Uses **Yarn 3.6.1** as package manager
- **Vite** for fast development and building
- **TypeScript strict mode** enabled
- **ESLint + Prettier** for code quality
- **Storybook** for component development and documentation
- **Madge** for dependency analysis
