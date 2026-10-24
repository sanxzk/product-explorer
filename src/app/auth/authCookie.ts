const AUTH_COOKIE = 'authToken';
export const AUTH_TOKEN_LIFETIME_SECONDS = 2 * 60 * 60;

export const readAuthToken = (): string | null => {
  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${AUTH_COOKIE}=`));

  if (!cookie) return null;

  try {
    return decodeURIComponent(cookie.slice(AUTH_COOKIE.length + 1)) || null;
  } catch {
    clearAuthToken();
    return null;
  }
};

export const saveAuthToken = (token: string): void => {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie =
    `${AUTH_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${AUTH_TOKEN_LIFETIME_SECONDS}; SameSite=Lax${secure}`;
};

export const clearAuthToken = (): void => {
  document.cookie = `${AUTH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
};
