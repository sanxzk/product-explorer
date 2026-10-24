import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./features/auth/Login";
import ProtectedRoute from "./protectedRoute";
import AccountHome from "./features/account/AccountHome";


export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <div>Something went wrong. Page not found.</div>,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <AccountHome />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);
