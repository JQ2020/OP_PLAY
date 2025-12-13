"use client";

import { useState, useEffect } from "react";
import { Loader2, User as UserIcon, Mail, Key, Calendar, Smartphone, Download, Heart, MessageSquare } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

type UserData = {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string | null;
  createdAt: string;
  _count: {
    reviews: number;
    downloads: number;
    wishlist: number;
    devices: number;
  };
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const togglePassword = (userId: string) => {
    setShowPasswords((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const maskPassword = (password: string) => "•".repeat(Math.min(password.length, 12));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-ink">用户管理</h1>
          <span className="text-sm text-ink-secondary">共 {users.length} 个用户</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-xl border border-border-light bg-surface p-8 text-center">
            <UserIcon className="mx-auto h-12 w-12 text-ink-tertiary" />
            <p className="mt-4 text-ink-secondary">暂无用户数据</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border-light bg-surface">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-light bg-surface-variant">
                  <th className="px-4 py-3 text-left text-sm font-medium text-ink-secondary">用户</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-ink-secondary">邮箱</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-ink-secondary">密码</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-ink-secondary">统计</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-ink-secondary">注册时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-variant/50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-ink">{user.name}</p>
                          <p className="text-xs text-ink-tertiary">{user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm text-ink">
                        <Mail size={14} className="text-ink-tertiary" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Key size={14} className="text-ink-tertiary" />
                        <code className="rounded bg-surface-variant px-2 py-1 text-xs font-mono text-ink">
                          {showPasswords.has(user.id) ? user.password : maskPassword(user.password)}
                        </code>
                        <button
                          onClick={() => togglePassword(user.id)}
                          className="text-xs text-primary hover:underline"
                        >
                          {showPasswords.has(user.id) ? "隐藏" : "显示"}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3 text-xs text-ink-secondary">
                        <span className="flex items-center gap-1" title="设备数">
                          <Smartphone size={12} /> {user._count.devices}
                        </span>
                        <span className="flex items-center gap-1" title="下载数">
                          <Download size={12} /> {user._count.downloads}
                        </span>
                        <span className="flex items-center gap-1" title="收藏数">
                          <Heart size={12} /> {user._count.wishlist}
                        </span>
                        <span className="flex items-center gap-1" title="评论数">
                          <MessageSquare size={12} /> {user._count.reviews}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm text-ink-secondary">
                        <Calendar size={14} className="text-ink-tertiary" />
                        {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
