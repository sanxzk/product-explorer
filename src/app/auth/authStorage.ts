import type { User } from '../../types/User';

const STORAGE_KEY = 'auth';

export interface PersistedAuth {
  authToken: string | null;
  user: User | null;
}

export const loadAuth = (): PersistedAuth => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedAuth;
      if (parsed.authToken && parsed.user) return parsed;
    }
  } catch {
    // corrupted or unavailable storage: fall through to logged-out state
  }
  return { authToken: null, user: null };
};

export const saveAuth = ({ authToken, user }: PersistedAuth): void => {
  try {
    if (authToken && user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ authToken, user }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // storage unavailable (private mode, quota): ignore
  }
};

/** Access token lifetime. Sent as expiresInMins on login and used as the cookie max-age. */
export const ACCESS_TOKEN_TTL_MINS = 30;

const TOKEN_COOKIE = 'authToken';

const setCookie = (name: string, value: string, maxAgeSeconds: number): void => {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie =
    `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
};

const getCookie = (name: string): string | null => {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
};

const removeCookie = (name: string): void => {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
};

export const getStoredToken = (): string | null => getCookie(TOKEN_COOKIE);

// Last value written to the cookie, so we only touch it when the token changes
// (not on every Redux action, which would keep extending the expiry).
let lastSynced: string | null = getStoredToken();

/** Call from store.subscribe: mirrors the Redux token into the cookie. */
export const storeToken = (token: string | null): void => {
  if (token === lastSynced) return;
  lastSynced = token;
  if (token) setCookie(TOKEN_COOKIE, token, ACCESS_TOKEN_TTL_MINS * 60);
  else removeCookie(TOKEN_COOKIE);
};