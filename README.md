# Product Explorer

A React, TypeScript, and Vite application scaffold. The current UI contains a sign-in prototype, Redux auth state, an Axios API client, and client-side routing. Product listing and detail pages are not implemented yet.

## Getting started

```sh
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in a local `.env` file to point API requests at the backend. If it is unset, Axios uses the current origin. The API client attaches the Redux auth token to requests and clears auth state after a `401` response.

## Source layout

- `src/app/` - Redux store, typed hooks, and auth state/thunks
- `src/api/` - shared Axios client
- `src/features/auth/` - sign-in prototype and its styles
- `src/routes.tsx` - application routes
- `src/types/` - shared TypeScript models

The sign-in screen is a frontend prototype; it is not connected to an authentication service and must not be used to collect real credentials.

## Checks

```sh
npm run build
npm run lint
```
