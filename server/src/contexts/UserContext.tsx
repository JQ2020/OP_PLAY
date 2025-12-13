"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  createdAt: string;
};

type UserContextType = {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<Pick<User, "name" | "email" | "avatar">>) => Promise<boolean>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = "play-store-user-id";

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUserId) {
      fetch(`/api/user/${storedUserId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setUser(data);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        return { success: false, error: data.error || "Login failed" };
      }

      const userData = await res.json();
      setUser(userData);
      localStorage.setItem(USER_STORAGE_KEY, userData.id);
      return { success: true };
    } catch {
      return { success: false, error: "Network error" };
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        return { success: false, error: data.error || "Registration failed" };
      }

      const userData = await res.json();
      setUser(userData);
      localStorage.setItem(USER_STORAGE_KEY, userData.id);
      return { success: true };
    } catch {
      return { success: false, error: "Network error" };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  const updateUser = useCallback(async (updates: Partial<Pick<User, "name" | "email" | "avatar">>) => {
    if (!user) return false;

    try {
      const res = await fetch(`/api/user/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) return false;

      const updatedUser = await res.json();
      setUser(updatedUser);
      return true;
    } catch {
      return false;
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, register, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
