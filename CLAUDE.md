# CLAUDE.md — product-db-web-refine

Frontend web application for Product-DB. Built with React + Refine (Material UI). Allows users to scan NF-e QR codes, browse sales, and view product price history.

## Commands

```bash
npm run dev          # Start dev server on port 3003
npm run dev:host     # Dev server accessible on LAN (--host)
npm run build        # TypeScript check + production build (Vite)
npm start            # Start production preview on port 3003
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (e.g. `http://localhost:3000`) |
| `VITE_DISABLE_AUTH` | Set to `"true"` to use mock auth in development |

To disable auth locally, create `.env.local` with `VITE_DISABLE_AUTH=true`.

## Architecture

### Refine Framework

The app uses [Refine](https://refine.dev/) as a React meta-framework for data-driven apps. Key concepts:

- **DataProvider** (`src/providers/data-provider.ts`): Custom provider wrapping axios. Translates Refine's CRUD operations into API calls to the backend. Response format: `{ success, result, total }`.
- **AuthProvider** (`src/providers/auth-provider.ts`): Dual-mode — mock provider when `VITE_DISABLE_AUTH=true`, production provider (Supabase JWT) otherwise.
- **Resources**: Defined in `App.tsx` — `sales` and `products`, each with list/show routes.

### Pages

| Route | Component | Description |
|---|---|---|
| `/products` | `ProductList` | DataGrid with ID, name, latest price, actions |
| `/products/show/:id` | `ProductShow` | Product details + full price history |
| `/products/edit/:id` | `ProductEdit` | Edit product name |
| `/sales` | `SaleList` | DataGrid with ID, date (pt-BR), total (BRL) |
| `/sales/show/:id` | `SaleShow` | Sale details: store, date, products, total |
| `/` | Redirects to `/products` | |

### QR Code Scanner

Located in the **Header** component (`src/components/header/index.tsx`):
- Toggle button (QR icon) mounts/unmounts the `BarcodeScanner` component
- `BarcodeScanner` (`src/components/barcode-scanner/index.tsx`) uses `react-zxing` to access the camera
- On successful decode, calls `createSaleFromInvoice(url)` which does `POST /sales` to the backend
- Shows success/error notification via Refine's `useNotification`

### Authentication Flow

1. On load, checks `VITE_DISABLE_AUTH` env var
2. **Production**: Login via `POST /auth/login` → stores `access_token`, `refresh_token`, `expires_at` in localStorage
3. **Token refresh**: Axios interceptor checks expiration before each request; if token expires within 60s, refreshes via `POST /auth/refresh`
4. **401 handling**: AuthProvider triggers logout on 401 errors

### HTTP Client

`src/shared/network.ts` — Axios instance with:
- `baseURL` from `VITE_API_URL`
- Request interceptor for token refresh + `Authorization: Bearer` header

## Project Structure

```
src/
├── App.tsx                    # Refine setup, routes, resources
├── index.tsx                  # React entry point
├── providers/
│   ├── data-provider.ts       # Custom Refine DataProvider (axios)
│   └── auth-provider.ts       # Dual-mode auth (mock/production)
├── pages/
│   ├── products/              # List, Show, Edit
│   ├── sales/                 # List, Show
│   ├── login.tsx              # Login page (Refine AuthPage)
│   ├── categories/            # Scaffolded but unused
│   └── blog-posts/            # Scaffolded but unused
├── components/
│   ├── header/index.tsx       # App header with QR scanner + theme toggle
│   └── barcode-scanner/index.tsx  # Camera QR reader (react-zxing)
├── services/index.ts          # createSaleFromInvoice API call
├── shared/
│   ├── network.ts             # Axios instance with auth interceptor
│   ├── storage.ts             # localStorage helpers for auth tokens
│   ├── constants.ts           # Storage key names
│   ├── currency-formatter.ts  # BRL currency formatting
│   └── date-formatter.ts      # Date formatting
└── contexts/
    └── color-mode/index.tsx   # Dark/light theme context (persisted in localStorage)
```

## Known Issues / TODOs

- `data-provider.ts:getList` makes a **duplicate HTTP request** (lines 26-33 and 35-42 are identical)
- `deleteOne`, `create`, `getMany`, and `custom` methods in the DataProvider are not implemented (TODO stubs)
- `categories/` and `blog-posts/` pages are Refine scaffold leftovers — not wired into the app

## Deployment

- **CI/CD**: GitHub Actions on push to `main`
  - Builds with `npm run build`
  - SCP copies `dist/` to Raspberry Pi
  - Reloads via PM2 (`pm2 reload product-db-web`)
- **Docker**: Multi-stage Dockerfile available (builds + serves with `serve` package)
