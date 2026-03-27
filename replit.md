# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── security-camera-site/ # Security camera business website
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## SwissCam Security Website

The main application is a full-stack security camera business website at `artifacts/security-camera-site`.

## Database

- **Development/Production**: Neon PostgreSQL (`NEON_DATABASE_URL` env var)
- DB config reads `NEON_DATABASE_URL` first, falls back to `DATABASE_URL`
- Run migrations: `NEON_DATABASE_URL=<url> pnpm --filter @workspace/db run push`

## Vercel Deployment

- `vercel.json` at the root configures the deployment
- Frontend: built statically from `artifacts/security-camera-site`
- API: `api/index.ts` is deployed as a Vercel serverless function
- Required env var in Vercel dashboard: `NEON_DATABASE_URL`

### Pages
- **Home** (`/`) - Hero section, features, testimonials
- **Products** (`/products`) - Grid of all camera products from DB
- **Product Details** (`/products/:id`) - Individual product page
- **Services** (`/services`) - Installation & maintenance services
- **Contact** (`/contact`) - Contact form + business info
- **Admin** (`/admin`) - Protected admin panel

### Admin Access
- URL: `/admin`
- Username: `admin`
- Password: `securevision2024`

### Database Tables
- `products` - Security camera products
- `contacts` - Contact form submissions

### API Routes
All at `/api`:
- `GET /products` - List all products
- `GET /products/:id` - Get single product
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)
- `POST /contacts` - Submit contact form
- `GET /contacts/list` - List all contacts (admin)
- `POST /admin/login` - Admin login (returns token)
- `GET /admin/verify` - Verify admin token

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references
