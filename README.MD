# product-db-web-refine

Frontend web application for Product-DB. Scan NF-e QR codes, browse sales, and track product price history.

Part of the [Product-DB](../README.md) ecosystem.

## Tech Stack

- **React 18** — UI library
- **Refine** — Data-driven app framework (CRUD, auth, routing)
- **Material UI** — Component library
- **MUI X DataGrid** — Table/grid component
- **Vite** — Build tool
- **react-zxing** — QR code / barcode scanning

## Getting Started

```bash
npm install
npm run dev
```

The app starts on port `3003`.

### Environment Variables

Create a `.env` file:
```
VITE_API_URL=http://localhost:3000
VITE_DISABLE_AUTH=true
```

Set `VITE_DISABLE_AUTH=true` for local development without authentication.

## Features

- **QR Code Scanner**: Header button opens the camera to scan NF-e QR codes. On scan, creates a new sale via the backend API.
- **Sales List**: Paginated list showing date and total (BRL currency).
- **Sale Details**: Shows store name, date, all products with prices, and total.
- **Products List**: Paginated, searchable list showing product name and latest price.
- **Product Details**: Shows product info and full price history with dates.
- **Product Edit**: Update product name.
- **Dark/Light Mode**: Theme toggle persisted in localStorage.
- **Authentication**: Supabase JWT with automatic token refresh.

## Deployment

- **GitHub Actions**: Build → SCP to Raspberry Pi → PM2 reload
- **Docker**: Multi-stage Dockerfile available for containerized deployment
