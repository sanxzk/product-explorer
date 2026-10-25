# Product Explorer

This project is a React + TypeScript product browsing app inspired by Amazon-style shopping pages. It lets users sign in, browse products, filter by category/brand/price, search products, view product details, and keep their last-used filters saved in the browser.

The app uses DummyJSON as its backend API and is designed for demo use.

## Live Link
Access the hosted application using the custom domain configured through AWS and GoDaddy:

https://leegality-assessment.sanjana-cloud.in/

## What this app does

- User login screen with Amazon-inspired design
- Protected routes for products and product detail pages
- Product listing with:
  - search
  - category filter
  - brand filter
  - price range filter
  - pagination
- Product detail page with image gallery, product description, reviews, and pricing
- Session restore using saved auth token
- Redux Persist storing product filter preferences in browser storage
- AWS deployment setup with CloudFront + custom domain

## Tech stack

- React 19
- TypeScript
- Vite
- Redux Toolkit
- Redux Persist
- React Router
- Axios
- Tailwind CSS
- DummyJSON API

## Demo login credentials

Use these credentials when testing the sign-in flow:

- Username: `emilys`
- Password: `emilyspass`

Important: this login screen is an Amazon-inspired UI only. It is not an actual Amazon authentication system. The credentials are demo credentials for DummyJSON.

## Project setup

1. Open the project folder.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root if needed.

```bash
VITE_API_BASE_URL=https://dummyjson.com
```

4. Start the app:

```bash
npm run dev
```

5. Open the local Vite URL in the browser.

### Production build

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## How the app works

### 1. Login flow

- The app opens on a login page.
- The user enters a username and password.
- The frontend sends a request to DummyJSON:
  - `POST /auth/login`
- On success, the API returns an `accessToken` and user data.
- The token is stored in a browser cookie named `authToken`.
- The user is redirected to the product listing page.

### 2. Session restore

On app startup, the app reads the saved token from the cookie.

- If a valid token exists, it calls:
  - `GET /auth/me`
- If the token is valid, the user stays logged in.
- If the token is invalid/expired, the app clears the cookie and sends the user back to the login page.

This is handled by the Redux auth slice and thunks.

### 3. Protected routes

Routes such as `/products` and `/product/:id` are protected:

- If the user is not authenticated, they are redirected to `/login`.
- If the session is being checked, the app shows a loading state.
- If validation fails, it gives the user the option to retry.

### 4. Product listing

The product listing page:

- loads categories once
- loads brand options based on current category
- fetches products based on filters
- supports search and pagination
- shows a loading state and a no-results message if no products match

### 5. Filters and search

The app stores filter data in Redux and saves selected filter values with Redux Persist.

The following values are persisted:

- query
- category
- minPrice
- maxPrice
- brands
- page
- sidebarOpen

This means when the user comes back to the product listing, the previous page and filter choices are kept.

### 6. Product detail page

When the user clicks a product, the app loads the product by ID using:

- `GET /products/:id`

The detail page displays:

- main product image
- image gallery
- product title and price
- rating
- brand and category
- description
- warranty and shipping information
- customer reviews

## API usage

The project uses DummyJSON endpoints. The main ones are:

- `POST /auth/login` — login with username/password
- `GET /auth/me` — validate the current user with the saved token
- `GET /products` — get product list
- `GET /products/search` — search products by keyword
- `GET /products/category/:category` — list products in a category
- `GET /products/categories` — get all product categories
- `GET /products/:id` — get a single product by ID

## Important technical notes from the project

These notes explain how the app works and why some decisions were made:

- The DummyJSON API does not support combining price and brand filters on the server-side.
- Because of that, when a price filter or brand filter is used, the app fetches a broader set of products and then applies filtering in the browser before pagination.
- Search and price input are debounced so the app does not call the API on every key press.
- Category and brand filtering update the list immediately.
- Product list filters are kept in Redux so they are not lost when leaving and returning to the listing page.
- The app saves only the filter state, not the entire product data, using Redux Persist.
- Protected routes restore session state through `/auth/me`.
- DummyJSON does not issue a secure HttpOnly cookie, so this app uses a JavaScript-readable cookie for demo purposes only.


## Project structure

- `src/app/` — Redux store, auth state, filter state, product state, and thunk logic
- `src/api/` — shared Axios client and authentication API functions
- `src/features/auth/` — login screen and auth UI components
- `src/features/product-listing/` — main product list page
- `src/features/product-detail/` — product detail page
- `src/components/` — shared UI components like Navbar, filters, product cards, and pagination
- `src/routes.tsx` — route definitions
- `src/types/` — TypeScript models for products, auth, and users
- `src/hooks/` — shared hooks like debounced value handling

## AWS and custom domain notes

This project was also set up for deployment on AWS.

- CI/CD was configured using GitHub Actions and AWS IAM
- The frontend was hosted using S3 and CloudFront
- A custom domain is connected to the deployment:
  - https://leegality-assessment.sanjana-cloud.in/


## Validation

The project was checked with:

```bash
npm run build
npm run lint
```

Both commands currently pass successfully.

## Summary

This is a complete demo product browsing application that combines:

- login and session validation
- product catalog browsing
- sophisticated filtering and pagination
- protected pages
- Redux-based state management
- backend API integration with DummyJSON
- AWS deployment support

It is intentionally easy to understand and well-suited as an assessment/demo project.
