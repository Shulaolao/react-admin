# Project Structure

## Monorepo Organization

This is a pnpm workspace monorepo with the following structure:

```
/
├── apps/           # Standalone applications
│   ├── web/        # React frontend application
│   └── server/     # Backend server (minimal setup)
└── packages/       # Shared packages
    ├── config/     # Shared configuration
    └── shared/     # Shared utilities and types
```

## Web App Structure (`apps/web/src/`)

```
src/
├── assets/         # Static assets (images, icons)
├── components/     # Reusable UI components
│   └── ui/         # Radix UI-based components (button, avatar, sidebar, etc.)
├── hooks/          # Custom React hooks (e.g., use-mobile.ts)
├── layout/         # Layout components
│   ├── components/ # Layout-specific components (header, main, menuTabs)
│   └── index.tsx   # Main layout with SidebarProvider
├── lib/            # Utility functions (utils.ts)
├── pages/          # Page components
│   ├── Home/       # Home page
│   ├── Route/      # Route pages (route1, route2)
│   └── Tools/      # Tool pages (e.g., dnd-kit demo)
├── routes/         # React Router configuration
│   └── index.ts    # Route definitions
├── styles/         # Global styles
│   └── index.css   # Main stylesheet
├── App.tsx         # Root component
└── main.tsx        # Application entry point
```

## Key Conventions

- **Path Alias**: `@/` maps to `src/` directory
- **Component Organization**: UI components in `components/ui/`, page components in `pages/`
- **Layout Pattern**: Single layout component with `<Outlet />` for nested routes
- **Routing**: Centralized route configuration in `routes/index.ts`
- **Styling**: Tailwind CSS with component-scoped styles where needed
- **TypeScript**: Strict typing with separate configs for app and node code

## Configuration Files

- `vite.config.ts`: Vite configuration with React plugin and Tailwind
- `tsconfig.json`: TypeScript project references
- `tsconfig.app.json`: App-specific TypeScript config
- `tsconfig.node.json`: Node/build-specific TypeScript config
- `eslint.config.js`: ESLint configuration
- `components.json`: shadcn/ui component configuration
