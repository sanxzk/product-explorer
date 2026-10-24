import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/hooks';
import { retrySession } from './app/auth/authSlice';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { user, sessionStatus } = useAppSelector((s) => s.auth);

  if (sessionStatus === 'idle' || sessionStatus === 'loading') {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50">
        <p role="status" className="text-slate-600">Checking your session…</p>
      </main>
    );
  }

  if (sessionStatus === 'failed') {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
        <div className="text-center">
          <p className="text-slate-700">Unable to validate your saved session.</p>
          <button
            type="button"
            onClick={() => dispatch(retrySession())}
            className="mt-3 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (sessionStatus !== 'authenticated' || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}