"use client";

import { apiFetch } from "@/lib/apiClient";
import { isExpired } from "@/lib/token";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: number;
  username: string;
} | null;

type UserContextType = {
  user: User;
  registerUser: (username: string, password: string) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem("userInfo");

    if (currentUser) {
      const refreshToken = localStorage.getItem("refreshToken") || "";
      if (isExpired(refreshToken)) return;

      const fetchUserInfo = async () => {
        const userInfo = await apiFetch("/auth/me").then((r) => r.json());
        setUser(userInfo);
      };

      fetchUserInfo();
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await apiFetch(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ username, password }),
      },
      false
    ).then((r) => r.json());

    if (!res.success) throw new Error(res.message);

    const accessToken = res.data.accessToken;
    const refreshToken = res.data.refreshToken;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    localStorage.setItem("userInfo", JSON.stringify(res.data));
    setUser(res.data ?? null);
  };

  const registerUser = async (username: string, password: string) => {
    const res = await apiFetch(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ username, password }),
      },
      false
    ).then((r) => r.json());

    if (!res.success) throw new Error(res.message);

    const accessToken = res.data.accessToken;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("userInfo", JSON.stringify(res.data));
    setUser(res.data ?? null);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, registerUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
