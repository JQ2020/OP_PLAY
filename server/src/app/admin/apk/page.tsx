"use client";

import { AdminLayout } from "@/components/AdminLayout";
import { Package, Calendar, HardDrive, FileText, Save, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

type ApkVersion = {
  id: string;
  version: string;
  versionCode: number;
  fileSize: string;
  releaseNote: string;
  downloadUrl: string;
  isActive: boolean;
  createdAt: string;
};

export default function AdminApkPage() {
  const [currentApk, setCurrentApk] = useState<ApkVersion | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState({
    version: "",
    versionCode: 1,
    fileSize: "25 MB",
    releaseNote: "",
    downloadUrl: "/apk/op-play.apk",
  });

  useEffect(() => {
    fetchCurrentApk();
  }, []);

  const fetchCurrentApk = async () => {
    const res = await fetch("/api/apk");
    if (res.ok) {
      const data = await res.json();
      setCurrentApk(data);
      setFormData({
        version: data.version || "",
        versionCode: data.versionCode || 1,
        fileSize: data.fileSize || "25 MB",
        releaseNote: data.releaseNote || "",
        downloadUrl: data.downloadUrl || "/apk/op-play.apk",
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const method = currentApk?.id ? "PUT" : "POST";
    const body = currentApk?.id
      ? { id: currentApk.id, ...formData, isActive: true }
      : formData;

    const res = await fetch("/api/admin/apk", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      await fetchCurrentApk();
      setMessage({ type: "success", text: "APK version info saved successfully!" });
    } else {
      setMessage({ type: "error", text: "Failed to save. Please try again." });
    }
    setSaving(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">APK Management</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage Android app version information for the download page.
            </p>
          </div>
          <a
            href="/download"
            target="_blank"
            className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ExternalLink className="h-4 w-4" />
            View Download Page
          </a>
        </div>

        {message && (
          <div
            className={`rounded-lg p-4 text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Current Version Card */}
        {currentApk && currentApk.id && (
          <div className="rounded-xl border border-green-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-500/5 dark:to-blue-500/5 p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 dark:bg-green-500/20 p-3">
                <Package className="h-6 w-6 text-green-600 dark:text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Current Version: v{currentApk.version}
                </h3>
                <div className="mt-1 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <HardDrive className="h-4 w-4" />
                    {currentApk.fileSize}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(currentApk.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <a
                href={currentApk.downloadUrl}
                download
                className="rounded-lg bg-primary-blue px-4 py-2 text-sm font-medium text-white hover:bg-primary-blue/90"
              >
                Download
              </a>
            </div>
            {currentApk.releaseNote && (
              <div className="mt-4 rounded-lg bg-white/80 dark:bg-gray-800/50 border border-gray-200 dark:border-transparent p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <FileText className="mr-2 inline h-4 w-4" />
                  {currentApk.releaseNote}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Version Info Form */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {currentApk?.id ? "Update Version Info" : "Create Version Info"}
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            {/* Version Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Version *</label>
                <input
                  type="text"
                  placeholder="1.0.0"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-primary-blue focus:outline-none focus:ring-1 focus:ring-primary-blue"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Version Code</label>
                <input
                  type="number"
                  min="1"
                  value={formData.versionCode}
                  onChange={(e) => setFormData({ ...formData, versionCode: parseInt(e.target.value) || 1 })}
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-primary-blue focus:outline-none focus:ring-1 focus:ring-primary-blue"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">File Size</label>
                <input
                  type="text"
                  placeholder="25 MB"
                  value={formData.fileSize}
                  onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-primary-blue focus:outline-none focus:ring-1 focus:ring-primary-blue"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Download URL</label>
                <input
                  type="text"
                  placeholder="/apk/op-play.apk"
                  value={formData.downloadUrl}
                  onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-primary-blue focus:outline-none focus:ring-1 focus:ring-primary-blue"
                />
              </div>
            </div>

            {/* Release Note */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Release Note</label>
              <textarea
                placeholder="What's new in this version..."
                value={formData.releaseNote}
                onChange={(e) => setFormData({ ...formData, releaseNote: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-primary-blue focus:outline-none focus:ring-1 focus:ring-primary-blue resize-none"
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={!formData.version || saving}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Version Info"}
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Note: APK file should be manually uploaded to /public/apk/op-play.apk
              </p>
            </div>
          </form>
        </div>

        {/* Instructions */}
        <div className="rounded-xl border border-amber-300 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 p-6">
          <h3 className="mb-2 text-sm font-semibold text-amber-900 dark:text-amber-400">
            How to update the APK file
          </h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-amber-800 dark:text-amber-300">
            <li>Build your Android app and generate the APK file</li>
            <li>Rename the APK file to <code className="rounded bg-amber-200 dark:bg-amber-900/50 px-1.5 py-0.5 text-amber-900 dark:text-amber-300">op-play.apk</code></li>
            <li>Place the file in <code className="rounded bg-amber-200 dark:bg-amber-900/50 px-1.5 py-0.5 text-amber-900 dark:text-amber-300">/public/apk/</code> directory</li>
            <li>Commit and deploy to update the download</li>
            <li>Update the version info above to reflect the changes</li>
          </ol>
        </div>
      </div>
    </AdminLayout>
  );
}
