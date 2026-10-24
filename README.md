# Product Explorer

A React, TypeScript, and Vite product explorer with product search, filters, pagination, and product detail pages.

## Getting started

```sh
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in a local `.env` file to point API requests at the backend. If it is unset, requests use the current origin.

## Persistence and authentication

Only product filters and listing preferences are persisted in browser local storage through Redux Persist. The app waits for those preferences to rehydrate before rendering, and validates stored values when migrating them.

After login, the app stores DummyJSON's access token in a JavaScript-readable `authToken` cookie for two hours. On app startup it reads the cookie and validates the token with `GET /auth/me`; invalid sessions clear the cookie and return the user to sign-in. Signing out clears the cookie. DummyJSON receives a two-hour token lifetime request through `expiresInMins: 120`.

**Security note:** a JavaScript-readable cookie is not `HttpOnly` and can be stolen by injected scripts (XSS). This is demo-only behavior, not suitable for production authentication. Production should use a backend-managed `HttpOnly; Secure; SameSite` session cookie instead. The Amazon-inspired login is not an Amazon sign-in service; use demo credentials only and never enter a real Amazon password.

## Assumptions and architecture

- The product API is DummyJSON. Its API does not support combining price and brand filters server-side, so filtered results are fetched and filtered in the browser before pagination.
- Product list filters live in Redux so the listing can be revisited without losing the selected values; only those filter preferences are persisted.
- Product detail data is fetched by ID when `/product/:id` opens. The Back to products link returns to the listing, where Redux retains the active filters and page.
- Search and price entry are debounced to avoid issuing a network request for every keystroke. Category and brand choices update the results immediately.
- Protected routes restore sessions through the backend's `/auth/me` endpoint. With DummyJSON only, refresh sign-in cannot persist because it does not issue the required HttpOnly cookie.

## Possible improvements

- Add a backend implementing the documented two-hour HttpOnly session cookie and session endpoints.
- Add automated reducer, API, and route tests, including combined filters, pagination reset, and browser refresh behavior.
- Cache product and category API responses and add retry/rate-limit behavior for transient failures.

## Source layout

- `src/app/` - Redux store, typed hooks, auth state/thunks, and filter persistence
- `src/api/` - shared Axios client and authentication API calls
- `src/features/auth/` - sign-in page and reusable form components
- `src/features/product-listing/` - product listing page
- `src/features/product-detail/` - product details page at `/product/:id`
- `src/components/` - shared product, filter, and navigation UI
- `src/routes.tsx` - application routes
- `src/types/` - shared TypeScript models

## Checks

```sh
npm run build
npm run lint
```
