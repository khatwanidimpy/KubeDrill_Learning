import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "./api";
import type { User } from "./types";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const { data } = await api.post("/login", { email, password });
          localStorage.setItem("auth_token", data.token);
          set({ user: data.user, token: data.token, loading: false });
        } catch (e) {
          set({ error: (e as Error).message, loading: false });
          throw e;
        }
      },

      register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          const { data } = await api.post("/register", { name, email, password });
          localStorage.setItem("auth_token", data.token);
          set({ user: data.user, token: data.token, loading: false });
        } catch (e) {
          set({ error: (e as Error).message, loading: false });
          throw e;
        }
      },

      fetchMe: async () => {
        if (!get().token) return;
        try {
          const { data } = await api.get("/me");
          set({ user: data.user });
        } catch {
          get().logout();
        }
      },

      logout: () => {
        localStorage.removeItem("auth_token");
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (s) => ({ user: s.user, token: s.token }),
    },
  ),
);
