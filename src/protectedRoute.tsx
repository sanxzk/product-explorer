import { useEffect, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchCurrentUser } from './app/auth/authThunks';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { authToken, user, userStatus } = useAppSelector((s) => s.auth);

  // Token came back from the cookie after a refresh, but we don't have the user yet
  useEffect(() => {
    if (authToken && !user && userStatus === 'idle') {
      dispatch(fetchCurrentUser());
    }
  }, [authToken, user, userStatus, dispatch]);

  if (!authToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user) {
    if (userStatus === 'failed') {
      // Network/server error (an expired token would already have logged us out)
      return (
        <div className="min-h-screen grid place-items-center text-[13px] text-[#0f1111]">
          <div className="text-center">
            <p className="mb-3">We couldn't load your account.</p>
            <button
              type="button"
              onClick={() => dispatch(fetchCurrentUser())}
              className="px-4 h-[31px] rounded-[3px] border border-[#adb1b8] bg-[linear-gradient(to_bottom,#f7f8fa,#e7e9ec)]"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen grid place-items-center">
        <div
          role="status"
          aria-label="Loading"
          className="h-8 w-8 animate-spin rounded-full border-2 border-[#ddd] border-t-[#e77600]"
        />
      </div>
    );
  }

  return <>{children}</>;
}