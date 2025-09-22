interface JwtPayload {
  sub?: string;
  typ?: string;
  aud?: string;
  iss?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

export function parseJWT(token: string): JwtPayload | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function isExpired(token: string): boolean {
  const payload = parseJWT(token);
  const exp = payload?.exp;

  if (!exp) return true;

  const now = Math.floor(Date.now() / 1000);

  return exp <= now;
}
