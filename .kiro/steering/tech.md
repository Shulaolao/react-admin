# Technology Stack

## Build System & Package Management

- **Package Manager**: pnpm (v10.9.0)
- **Monorepo**: pnpm workspaces
- **Build Tool**: Vite (v7.2.4)
- **Module System**: ES Modules

## Frontend Stack

- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Routing**: React Router DOM v7.11.0
- **Styling**: Tailwind CSS v4.1.18
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Drag & Drop**: @dnd-kit

## Development Tools

- **Linter**: ESLint v9
- **React Compiler**: babel-plugin-react-compiler (enabled)
- **Dev Server Port**: 5017

## Common Commands

```bash
# Install dependencies
pnpm install

# Start web app development server
cd apps/web
pnpm dev

# Build web app for production
cd apps/web
pnpm build

# Run linter
cd apps/web
pnpm lint

# Preview production build
cd apps/web
pnpm preview
```

## Key Libraries

- **class-variance-authority**: Component variant management
- **clsx** & **tailwind-merge**: Utility class management
- **@dnd-kit**: Drag and drop functionality
- **@radix-ui**: Accessible UI primitives (avatar, dialog, tabs, tooltip, etc.)
