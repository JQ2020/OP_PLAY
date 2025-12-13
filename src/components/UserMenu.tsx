"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { User, LogOut, Settings, History, Heart, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function UserMenu() {
  const { user, isLoggedIn, isLoading, login, register, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAvatarClick = () => {
    if (isLoggedIn) {
      setIsOpen(!isOpen);
    } else {
      setShowAuthModal(true);
    }
  };

  const initial = user?.name?.charAt(0).toUpperCase() || "?";

  if (isLoading) {
    return (
      <div className="ml-2 flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={handleAvatarClick}
        className="ml-2 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full overflow-hidden transition-opacity hover:opacity-90 active:scale-95"
        aria-label="User account"
      >
        {user?.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
        ) : (
          <span className={`flex h-full w-full items-center justify-center text-sm font-medium text-white ${isLoggedIn ? "bg-[#ea4335]" : "bg-gray-400"}`}>
            {initial}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-14 z-50 w-72 origin-top-right rounded-xl border border-border-light bg-white shadow-lg dark:bg-surface"
          >
            <div className="border-b border-border-light p-4">
              <div className="flex items-center gap-3">
                {user?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt={user.name} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ea4335] text-lg font-medium text-white">
                    {initial}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-ink">{user?.name}</p>
                  <p className="truncate text-sm text-ink-secondary">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink transition-colors hover:bg-surface-variant"
              >
                <User size={18} className="text-ink-secondary" />
                <span>Profile</span>
              </Link>
              <Link
                href="/profile?tab=history"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink transition-colors hover:bg-surface-variant"
              >
                <History size={18} className="text-ink-secondary" />
                <span>Download history</span>
              </Link>
              <Link
                href="/profile?tab=wishlist"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink transition-colors hover:bg-surface-variant"
              >
                <Heart size={18} className="text-ink-secondary" />
                <span>Wishlist</span>
              </Link>
              <Link
                href="/profile?tab=settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink transition-colors hover:bg-surface-variant"
              >
                <Settings size={18} className="text-ink-secondary" />
                <span>Settings</span>
              </Link>
            </div>

            <div className="border-t border-border-light p-2">
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink transition-colors hover:bg-surface-variant"
              >
                <LogOut size={18} className="text-ink-secondary" />
                <span>Sign out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={login}
        onRegister={register}
      />
    </div>
  );
}

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onRegister: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
};

function AuthModal({ isOpen, onClose, onLogin, onRegister }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = mode === "login"
      ? await onLogin(email, password)
      : await onRegister(name, email, password);

    setLoading(false);

    if (result.success) {
      onClose();
      resetForm();
    } else {
      setError(result.error || "An error occurred");
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-medium text-ink">
                {mode === "login" ? "Sign in" : "Create account"}
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 transition-colors hover:bg-surface-variant"
              >
                <X size={20} className="text-ink-secondary" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary dark:bg-surface-variant"
                    placeholder="Your name"
                    required
                  />
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary dark:bg-surface-variant"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary dark:bg-surface-variant"
                  placeholder="••••••••"
                  required
                  minLength={4}
                />
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading
                  ? (mode === "login" ? "Signing in..." : "Creating account...")
                  : (mode === "login" ? "Sign in" : "Create account")}
              </button>

              <p className="text-center text-sm text-ink-secondary">
                {mode === "login" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button type="button" onClick={switchMode} className="text-primary hover:underline">
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button type="button" onClick={switchMode} className="text-primary hover:underline">
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
