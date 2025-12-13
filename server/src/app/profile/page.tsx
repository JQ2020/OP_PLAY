"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { User, History, Heart, Settings, Star, Edit2, Camera } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { StarRating } from "@/components/StarRating";

type Tab = "profile" | "history" | "wishlist" | "settings";

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "history", label: "Download history", icon: History },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function ProfilePage() {
  const { user, isLoggedIn, updateUser } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const tab = searchParams.get("tab") as Tab;
    if (tab && tabs.some((t) => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !user) {
    return null;
  }

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    router.push(`/profile?tab=${tab}`, { scroll: false });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      await updateUser({ avatar: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex flex-col items-center gap-4 rounded-2xl bg-white p-6 dark:bg-surface md:flex-row md:items-start">
              <div className="relative">
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#ea4335] text-3xl font-medium text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <button
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-50 dark:bg-surface-variant dark:hover:bg-gray-700"
                >
                  <Camera size={16} className="text-ink-secondary" />
                </button>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-medium text-ink">{user.name}</h1>
                <p className="text-sm text-ink-secondary">{user.email}</p>
                <p className="mt-1 text-xs text-ink-secondary">
                  Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>

            <div className="mb-6 flex gap-2 overflow-x-auto rounded-xl bg-white p-2 dark:bg-surface">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-ink-secondary hover:bg-surface-variant"
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "profile" && <ProfileTab user={user} updateUser={updateUser} />}
              {activeTab === "history" && <HistoryTab userId={user.id} />}
              {activeTab === "wishlist" && <WishlistTab userId={user.id} />}
              {activeTab === "settings" && <SettingsTab />}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

type ProfileTabProps = {
  user: NonNullable<ReturnType<typeof useUser>["user"]>;
  updateUser: ReturnType<typeof useUser>["updateUser"];
};

function ProfileTab({ user, updateUser }: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [reviews, setReviews] = useState<Array<{
    id: string;
    rating: number;
    content: string;
    createdAt: string;
    app: { id: string; title: string; iconUrl: string };
  }>>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
  }, [user.name, user.email]);

  useEffect(() => {
    fetch(`/api/user/${user.id}/history?type=reviews`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .finally(() => setLoadingReviews(false));
  }, [user.id]);

  const handleSave = async () => {
    await updateUser({ name: name.trim(), email: email.trim() });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setIsEditing(false);
  };

  return (
    <div className="rounded-2xl bg-white p-6 dark:bg-surface">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-ink">Personal information</h2>
        <button
          onClick={isEditing ? handleCancel : () => setIsEditing(true)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-primary transition-colors hover:bg-primary/10"
        >
          <Edit2 size={16} />
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-secondary">Name</label>
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-primary dark:bg-surface-variant"
            />
          ) : (
            <p className="text-ink">{user.name}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-secondary">Email</label>
          {isEditing ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-primary dark:bg-surface-variant"
            />
          ) : (
            <p className="text-ink">{user.email}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-secondary">Member since</label>
          <p className="text-ink">
            {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>

        {isEditing && (
          <button
            onClick={handleSave}
            disabled={!name.trim() || !email.trim()}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Save changes
          </button>
        )}
      </div>

      <div className="mt-8 border-t border-border-light pt-6">
        <h3 className="mb-4 text-lg font-medium text-ink">Your reviews</h3>
        {loadingReviews ? (
          <div className="animate-pulse space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl bg-surface-variant p-4">
                <div className="h-12 w-12 rounded-xl bg-gray-300 dark:bg-gray-600" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-gray-300 dark:bg-gray-600" />
                  <div className="h-3 w-48 rounded bg-gray-300 dark:bg-gray-600" />
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((review) => (
              <Link
                key={review.id}
                href={`/app/${review.app.id}`}
                className="flex items-start gap-4 rounded-xl bg-surface-variant p-4 transition-colors hover:bg-border-light"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={review.app.iconUrl} alt={review.app.title} className="h-12 w-12 rounded-xl" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink">{review.app.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <StarRating rating={review.rating} size={12} />
                    <span className="text-xs text-ink-secondary">
                      {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink-secondary line-clamp-2">{review.content}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-4 rounded-xl bg-surface-variant p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Star size={24} className="text-primary" />
            </div>
            <div>
              <p className="font-medium text-ink">No reviews yet</p>
              <p className="text-sm text-ink-secondary">Your feedback helps other users</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryTab({ userId }: { userId: string }) {
  const [downloads, setDownloads] = useState<Array<{
    id: string;
    createdAt: string;
    app: { id: string; title: string; iconUrl: string; developer: string };
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/user/${userId}/history?type=downloads`)
      .then((res) => res.json())
      .then((data) => setDownloads(data))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 dark:bg-surface">
        <h2 className="mb-4 text-lg font-medium text-ink">Download history</h2>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl bg-surface-variant p-4">
              <div className="h-12 w-12 rounded-xl bg-gray-300 dark:bg-gray-600" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-gray-300 dark:bg-gray-600" />
                <div className="h-3 w-24 rounded bg-gray-300 dark:bg-gray-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 dark:bg-surface">
      <h2 className="mb-4 text-lg font-medium text-ink">Download history</h2>
      {downloads.length > 0 ? (
        <div className="space-y-3">
          {downloads.map((download) => (
            <Link
              key={download.id}
              href={`/app/${download.app.id}`}
              className="flex items-center gap-4 rounded-xl bg-surface-variant p-4 transition-colors hover:bg-border-light"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={download.app.iconUrl} alt={download.app.title} className="h-12 w-12 rounded-xl" />
              <div className="flex-1">
                <p className="font-medium text-ink">{download.app.title}</p>
                <p className="text-sm text-ink-secondary">
                  Downloaded {new Date(download.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-ink-secondary">No download history yet</p>
      )}
    </div>
  );
}

function WishlistTab({ userId }: { userId: string }) {
  const [wishlist, setWishlist] = useState<Array<{
    id: string;
    createdAt: string;
    app: { id: string; title: string; iconUrl: string; developer: string; rating: number };
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/wishlist?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setWishlist(data))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleRemove = async (appId: string) => {
    await fetch("/api/wishlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, appId }),
    });
    setWishlist((prev) => prev.filter((item) => item.app.id !== appId));
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 dark:bg-surface">
        <h2 className="mb-4 text-lg font-medium text-ink">Wishlist</h2>
        <div className="animate-pulse space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl bg-surface-variant p-4">
              <div className="h-12 w-12 rounded-xl bg-gray-300 dark:bg-gray-600" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-gray-300 dark:bg-gray-600" />
                <div className="h-3 w-24 rounded bg-gray-300 dark:bg-gray-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 dark:bg-surface">
      <h2 className="mb-4 text-lg font-medium text-ink">Wishlist</h2>
      {wishlist.length > 0 ? (
        <div className="space-y-3">
          {wishlist.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-xl bg-surface-variant p-4">
              <Link href={`/app/${item.app.id}`} className="flex flex-1 items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.app.iconUrl} alt={item.app.title} className="h-12 w-12 rounded-xl" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink">{item.app.title}</p>
                  <p className="text-sm text-ink-secondary">{item.app.developer}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <StarRating rating={item.app.rating} size={12} />
                    <span className="text-xs text-ink-secondary">{item.app.rating.toFixed(1)}</span>
                  </div>
                </div>
              </Link>
              <button
                onClick={() => handleRemove(item.app.id)}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-4 rounded-xl bg-surface-variant p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Heart size={24} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-ink">Your wishlist is empty</p>
            <p className="text-sm text-ink-secondary">Save apps you want to download later</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="rounded-2xl bg-white p-6 dark:bg-surface">
      <h2 className="mb-4 text-lg font-medium text-ink">Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl bg-surface-variant p-4">
          <div>
            <p className="font-medium text-ink">Push notifications</p>
            <p className="text-sm text-ink-secondary">Receive updates about your apps</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" defaultChecked className="peer sr-only" />
            <div className="h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full"></div>
          </label>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-surface-variant p-4">
          <div>
            <p className="font-medium text-ink">Auto-update apps</p>
            <p className="text-sm text-ink-secondary">Update apps over Wi-Fi only</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" defaultChecked className="peer sr-only" />
            <div className="h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full"></div>
          </label>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-surface-variant p-4">
          <div>
            <p className="font-medium text-ink">Download over cellular</p>
            <p className="text-sm text-ink-secondary">Allow downloads without Wi-Fi</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" className="peer sr-only" />
            <div className="h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full"></div>
          </label>
        </div>

        <div className="mt-6 border-t border-border-light pt-6">
          <button className="w-full rounded-lg border border-red-500 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10">
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}
