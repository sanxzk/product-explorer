import { useState, type SubmitEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearAuthError } from '../../app/auth/authSlice';
import { loginUser } from '../../app/auth/authThunks';
import AuthInput from './components/AuthInput';
import AuthButton from './components/AuthButton';
import AuthLink from './components/AuthLink';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { authToken, status, error: serverError } = useAppSelector((s) => s.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const loading = status === 'loading';
  const errorMessage = validationError || serverError;

  // Where to go after login (set by ProtectedRoute), default "/"
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/';
  if (authToken) return <Navigate to={from} replace />;

  const resetErrors = () => {
    if (validationError) setValidationError('');
    if (serverError) dispatch(clearAuthError());
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim()) return setValidationError('Enter your username');
    if (!password) return setValidationError('Enter your password');

    setValidationError('');
    dispatch(loginUser({ username: username.trim(), password }));
    // On success the slice stores the token and the <Navigate /> above redirects.
  };

  return (
    <div className="min-h-screen bg-white text-[#0f1111] font-[Arial,Helvetica,sans-serif] text-[13px] leading-[19px] flex flex-col items-center">
      <header className="pt-[14px] pb-[18px]">
        <a
          href="/"
          aria-label="Home"
          className="relative inline-block text-[34px] font-bold tracking-[-1.5px] text-[#111] no-underline hover:no-underline hover:text-[#111]"
        >
          amazon
          <span className="ml-px text-[15px] font-normal tracking-normal">.com</span>
          <span
            aria-hidden="true"
            className="absolute left-2 bottom-0.5 w-[52px] h-2 border-b-[3px] border-[#f90] rounded-b-[40px]"
          />
        </a>
      </header>

      <main className="w-[350px] max-w-[calc(100%-32px)]">
        {errorMessage && (
          <div
            role="alert"
            className="flex gap-3 border border-[#c40000] rounded px-[18px] py-[14px] mb-[14px]"
          >
            <span
              aria-hidden="true"
              className="flex-none w-[22px] h-[22px] mt-px rounded-full bg-[#c40000] text-white font-bold text-[15px] flex items-center justify-center"
            >
              !
            </span>
            <div>
              <h4 className="m-0 text-[17px] font-normal leading-tight text-[#c40000]">
                There was a problem
              </h4>
              <p className="mt-0.5 mb-0 text-[13px]">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="border border-[#ddd] rounded-lg px-[26px] pt-5 pb-[22px] mb-[22px]">
          <h1 className="m-0 mb-[14px] text-[28px] font-normal leading-tight">Sign in</h1>

          <form onSubmit={handleSubmit} noValidate>
            <AuthInput
              id="username"
              label="Username"
              type="text"
              value={username}
              autoComplete="username"
              autoFocus
              hasError={!!errorMessage}
              disabled={loading}
              onChange={(e) => {
                setUsername(e.target.value);
                resetErrors();
              }}
            />

            <AuthInput
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              autoComplete="current-password"
              hasError={!!errorMessage}
              disabled={loading}
              labelAside={
                <AuthLink href="#" className="text-xs">
                  Forgot password
                </AuthLink>
              }
              onChange={(e) => {
                setPassword(e.target.value);
                resetErrors();
              }}
            />

            <label className="flex items-center gap-1.5 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <span>Show password</span>
            </label>

            <AuthButton type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </AuthButton>

            <p className="text-xs mt-[18px] mb-0">
              By continuing, you agree to Amazon's{' '}
              <AuthLink href="#">Conditions of Use</AuthLink> and{' '}
              <AuthLink href="#">Privacy Notice</AuthLink>.
            </p>
          </form>
        </div>

        {/* DEMO ONLY: remove before shipping */}
        <p className="mb-[22px] px-3 py-2 text-xs text-[#565959] bg-[#f6f6f6] rounded">
          Demo login: <b>emilys</b> / <b>emilyspass</b>
        </p>

        <div className="relative text-center mb-[14px] leading-none">
          <div className="absolute inset-x-0 top-1/2 border-t border-[#e7e7e7]" />
          <span className="relative bg-white px-2 text-xs text-[#767676]">New to Amazon?</span>
        </div>
        <AuthButton variant="secondary">Create your Amazon account</AuthButton>
      </main>

      <footer className="w-full mt-10 px-4 pt-6 pb-10 text-center text-[11px]">
        <div className="h-px mb-6 bg-[linear-gradient(to_right,transparent,#ddd_20%,#ddd_80%,transparent)]" />
        <nav className="flex gap-[18px] justify-center mb-2">
          <AuthLink href="#">Conditions of Use</AuthLink>
          <AuthLink href="#">Privacy Notice</AuthLink>
          <AuthLink href="#">Help</AuthLink>
        </nav>
        <p className="m-0 text-[#555]">© 1996-2026, Amazon.com, Inc. or its affiliates</p>
      </footer>
    </div>
  );
}