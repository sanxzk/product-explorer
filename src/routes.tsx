import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProductDetail from './features/product-detail/ProductDetail';
import ProductListing from './features/product-listing/ProductListing';
import LoginPage from './features/auth/Login';
import ProtectedRoute from './protectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <div>Something went wrong. Page not found.</div>,
    children: [
      {
        index: true,
        element: <Navigate to="/products" replace />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'products',
        element: (
          <ProtectedRoute>
            <ProductListing />
          </ProtectedRoute>
        ),
      },
      {
        path: 'product/:id',
        element: (
          <ProtectedRoute>
            <ProductDetail />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
