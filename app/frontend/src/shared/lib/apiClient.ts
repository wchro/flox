import { isExpired } from "./token";

export const apiBase = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  checkAuth: boolean = true
) {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (checkAuth) {
    let accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    // Verificar si el token esta caducado
    if (accessToken && isExpired(accessToken)) {
      const refreshToken =
        typeof window !== "undefined"
          ? localStorage.getItem("refreshToken")
          : null;
      if (refreshToken) {
        const res = await fetch(`${apiBase}/auth/refresh`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        }).then((res) => res.json());

        // Actualizar tokens
        if (res?.success) {
          const newAccessToken = res?.data?.accessToken;
          const newRefreshToken = res?.data?.refreshToken;

          localStorage.setItem("accessToken", newAccessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          accessToken = newAccessToken;
        }
      }
    }

    // establecer token en el header
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  }

  //   hacer request
  const res = await fetch(`${apiBase}${path}`, { ...options, headers });

  return res;
}
