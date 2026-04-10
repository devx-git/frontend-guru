"use client";

import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  nombre: string;
  pais?: string;
  moneda?: string;
  rol?: {
    id: string;
    nombre: string;
  };
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  setAuth: (token: string, user: User | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

// Función segura para obtener user del localStorage
const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr || userStr === "null" || userStr === "undefined") return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Función segura para obtener token del localStorage
const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token || token === "null" || token === "undefined") return null;
  return token;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: getStoredToken(),
  user: getStoredUser(),
  isLoading: false,

  setAuth: (token, user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    }
    set({ token, user });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    set({ token: null, user: null });
    window.location.href = "/login";
  },

  setLoading: (loading) => set({ isLoading: loading }),
}));