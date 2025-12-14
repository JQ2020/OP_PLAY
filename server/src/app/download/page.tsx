"use client";

import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { QRCodeSVG } from "qrcode.react";
import {
  Download,
  Smartphone,
  Search,
  Star,
  Zap,
  Shield,
  Palette,
  Bell,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

type ApkInfo = {
  version: string;
  fileSize: string;
  downloadUrl: string;
  releaseNote: string;
};

const features = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Find apps instantly with powerful search and filters",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Zap,
    title: "Remote Install",
    description: "Push apps to your device directly from the web",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Star,
    title: "Editors' Choice",
    description: "Curated premium apps with stellar reviews",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Palette,
    title: "Dark & Light Mode",
    description: "Switch themes to match your personal style",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Bell,
    title: "Real-time Progress",
    description: "Track downloads with live progress updates",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Shield,
    title: "Secure Downloads",
    description: "Verified apps from trusted sources only",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
];

const categories = [
  { name: "Apps", color: "from-blue-500 to-cyan-500" },
  { name: "Games", color: "from-purple-500 to-pink-500" },
  { name: "Kids", color: "from-amber-500 to-orange-500" },
  { name: "Books", color: "from-green-500 to-emerald-500" },
  { name: "Movies", color: "from-red-500 to-rose-500" },
];

const highlights = [
  "Curated quality apps",
  "Fast & secure downloads",
  "Personalized recommendations",
  "User reviews & ratings",
];

export default function DownloadPage() {
  const [apkInfo, setApkInfo] = useState<ApkInfo | null>(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetch("/api/apk")
      .then((res) => res.json())
      .then(setApkInfo)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isClient) {
      const apkPath = apkInfo?.downloadUrl || "/apk/op-play.apk";
      setDownloadUrl(`${window.location.origin}${apkPath}`);
    }
  }, [isClient, apkInfo]);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-background">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeKey="download" />
        <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 lg:px-10 lg:py-8 lg:pb-8">
          <div className="mx-auto max-w-5xl">
            {/* Hero Section */}
            <section className="relative mb-10 overflow-hidden rounded-3xl">
              {/* Animated Gradient Background */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                  backgroundSize: "200% 200%",
                  animation: "gradientShift 8s ease infinite",
                }}
              />
              <div className="absolute inset-0 bg-black/10" />

              <div className="relative z-10 flex flex-col items-center gap-8 p-6 md:flex-row md:justify-between md:p-10">
                {/* Left: App Info */}
                <div className="text-center md:text-left">
                  <div className="mb-6 flex items-center justify-center gap-4 md:justify-start">
                    <div className="relative h-20 w-20 overflow-hidden rounded-2xl border-2 border-white/30 shadow-2xl">
                      <Image
                        src="/oppo_market_icon.png"
                        alt="OP Play"
                        fill
                        className="object-contain bg-white"
                        priority
                      />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white md:text-4xl">
                        OP Play
                      </h1>
                      <p className="mt-1 text-sm text-white/80">
                        Your Premium App Store
                      </p>
                    </div>
                  </div>

                  <p className="mb-6 max-w-md text-lg leading-relaxed text-white/90">
                    Discover, download, and manage your favorite apps with the most intuitive app store experience on Android.
                  </p>

                  {/* Highlights */}
                  <div className="mb-6 flex flex-wrap justify-center gap-3 md:justify-start">
                    {highlights.map((item) => (
                      <span
                        key={item}
                        className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
                      >
                        <CheckCircle className="h-3 w-3" />
                        {item}
                      </span>
                    ))}
                  </div>

                  {apkInfo && (
                    <div className="mb-6 flex flex-wrap items-center justify-center gap-3 text-sm text-white/80 md:justify-start">
                      <span className="rounded-full bg-white/20 px-3 py-1">v{apkInfo.version}</span>
                      <span className="rounded-full bg-white/20 px-3 py-1">{apkInfo.fileSize}</span>
                      <span className="rounded-full bg-white/20 px-3 py-1">Android 8.0+</span>
                    </div>
                  )}

                  <a
                    href={apkInfo?.downloadUrl || "/apk/op-play.apk"}
                    download
                    className="inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-purple-600 shadow-xl transition-all hover:scale-105 hover:shadow-2xl active:scale-100"
                  >
                    <Download className="h-6 w-6" />
                    Download APK
                  </a>
                </div>

                {/* Right: QR Code */}
                <div className="hidden flex-col items-center md:flex">
                  <div className="rounded-2xl bg-white p-4 shadow-2xl">
                    {isClient && downloadUrl && (
                      <QRCodeSVG
                        value={downloadUrl}
                        size={160}
                        level="H"
                        includeMargin
                      />
                    )}
                  </div>
                  <p className="mt-4 flex items-center gap-2 text-sm text-white/80">
                    <Smartphone className="h-4 w-4" />
                    Scan to download
                  </p>
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section className="mb-10">
              <div className="mb-6 flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Why OP Play?
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6 transition-all hover:border-primary-blue hover:shadow-lg hover:bg-white dark:hover:bg-gray-800"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`mb-4 inline-flex rounded-xl ${feature.bgColor} p-3`}>
                        <Icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Categories Section */}
            <section className="mb-10">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Explore Categories
                </h2>
                <a
                  href="/"
                  className="group flex items-center gap-1 text-sm font-medium text-primary-blue transition-colors hover:text-primary-blue/80"
                >
                  Browse all
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <div
                    key={cat.name}
                    className={`rounded-full bg-gradient-to-r ${cat.color} px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl`}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            </section>

            {/* Release Notes */}
            {apkInfo?.releaseNote && (
              <section className="mb-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  What&apos;s New in v{apkInfo.version}
                </h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {apkInfo.releaseNote}
                </p>
              </section>
            )}

            {/* Mobile QR Section */}
            <section className="mb-10 rounded-xl border border-purple-200 dark:border-gray-800 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 p-6 md:hidden">
              <div className="flex flex-col items-center text-center">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Scan QR Code to Download
                </h3>
                <div className="rounded-xl bg-white p-3 shadow-lg border border-gray-100">
                  {isClient && downloadUrl && (
                    <QRCodeSVG
                      value={downloadUrl}
                      size={140}
                      level="H"
                      includeMargin
                    />
                  )}
                </div>
                <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                  Open camera app and scan this code
                </p>
              </div>
            </section>

            {/* Installation Guide */}
            <section className="rounded-xl border border-amber-300 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 p-6">
              <h3 className="mb-4 text-lg font-semibold text-amber-900 dark:text-amber-400">
                Installation Guide
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-amber-800 dark:text-amber-300">
                <li>Download the APK file by clicking the button above</li>
                <li>Open the downloaded file from your notification bar or file manager</li>
                <li>If prompted, allow installation from unknown sources in Settings</li>
                <li>Tap &quot;Install&quot; and wait for the installation to complete</li>
                <li>Open OP Play and start exploring amazing apps!</li>
              </ol>
            </section>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
