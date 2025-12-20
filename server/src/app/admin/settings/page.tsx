import { AdminLayout } from "@/components/AdminLayout";
import { Settings as SettingsIcon, Database, Server, Shield } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Settings</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            Configure your admin panel and system preferences.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* General Settings */}
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <SettingsIcon className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-ink">General</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Store Name
                </label>
                <input
                  type="text"
                  defaultValue="O Play"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Admin Email
                </label>
                <input
                  type="email"
                  defaultValue="admin@op.com"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                />
              </div>
            </div>
          </div>

          {/* Database Settings */}
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-2">
                <Database className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-ink">Database</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border-light p-4">
                <div>
                  <p className="text-sm font-medium text-ink">Database Status</p>
                  <p className="text-xs text-ink-secondary">SQLite Connection</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Connected
                </span>
              </div>
              <button className="w-full rounded-lg border border-border bg-surface-variant px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-border">
                Backup Database
              </button>
            </div>
          </div>

          {/* API Settings */}
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <Server className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-ink">API</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  API Endpoint
                </label>
                <input
                  type="text"
                  defaultValue="/api"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                  disabled
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">Rate Limiting</p>
                  <p className="text-xs text-ink-secondary">Protect against abuse</p>
                </div>
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-blue transition-colors"
                >
                  <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-white transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-red-500/10 p-2">
                <Shield className="h-5 w-5 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-ink">Security</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">Two-Factor Auth</p>
                  <p className="text-xs text-ink-secondary">Add extra security</p>
                </div>
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-surface-variant transition-colors"
                >
                  <span className="inline-block h-4 w-4 translate-x-1 transform rounded-full bg-white transition-transform" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">Auto Logout</p>
                  <p className="text-xs text-ink-secondary">After 30 minutes</p>
                </div>
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-blue transition-colors"
                >
                  <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-white transition-transform" />
                </button>
              </div>
              <button className="w-full rounded-lg border border-red-500 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20">
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="rounded-lg bg-primary-blue px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-blue/90 active:scale-95">
            Save Changes
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
