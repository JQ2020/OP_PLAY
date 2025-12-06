import Image from "next/image";
import { notFound } from "next/navigation";
import { InstallButton } from "@/components/InstallButton";
import { prisma } from "@/lib/prisma";
import { ShieldCheck } from "lucide-react";

type AppPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AppPage({ params }: AppPageProps) {
  const { id } = await params;
  const app = await prisma.app.findUnique({
    where: { id },
  });

  if (!app) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-surface px-6 py-10 text-ink">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-6 rounded-3xl bg-surfaceContainer p-8 shadow-card sm:flex-row">
          <div className="relative h-28 w-28 overflow-hidden rounded-2xl shadow-card sm:h-32 sm:w-32">
            <Image
              src={app.iconUrl}
              alt={`${app.title} icon`}
              fill
              sizes="160px"
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-medium">{app.title}</h1>
              <p className="text-green-700">{app.developer}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                <span className="font-medium text-ink">{app.rating.toFixed(1)} ★</span>
                <span className="text-muted">|</span>
                <span>{app.downloads} downloads</span>
                <span className="text-muted">|</span>
                <span>Rated for 12+</span>
              </div>
            </div>

            <div className="w-full sm:max-w-xs">
              <InstallButton appId={app.id} isInstalled={app.isInstalled} />
            </div>
          </div>
        </header>

        <section className="rounded-2xl bg-surfaceContainer p-6 shadow-card">
          <h2 className="text-xl font-semibold text-ink">About this app</h2>
          <p className="mt-3 text-sm text-muted leading-relaxed">{app.description}</p>
        </section>

        <section className="rounded-2xl bg-surfaceContainer p-6 shadow-card">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-primary/10 p-2 text-primary">
              <ShieldCheck className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-ink">Data Safety</h3>
              <p className="text-sm text-muted">
                The developer says this app does not share data with third parties.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
