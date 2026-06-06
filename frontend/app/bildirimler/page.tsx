"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Clock,
  FileWarning,
  CheckCircle2,
  UserPlus,
  BellOff,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { useBuildings } from "@/components/BuildingsProvider";
import { buildNotifications, type NotificationKind } from "@/lib/notifications";

const META: Record<
  NotificationKind,
  { icon: LucideIcon; color: string; bg: string; label: string }
> = {
  approval: {
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    label: "Onay",
  },
  missing: {
    icon: FileWarning,
    color: "text-rose-600",
    bg: "bg-rose-50",
    label: "Eksik Belge",
  },
  unassigned: {
    icon: UserPlus,
    color: "text-violet-600",
    bg: "bg-violet-50",
    label: "Atama",
  },
  delivered: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    label: "Tamamlandı",
  },
};

export default function BildirimlerPage() {
  const { buildings } = useBuildings();
  const notifications = useMemo(
    () => buildNotifications(buildings),
    [buildings],
  );

  return (
    <main className="scroll-thin min-w-0 flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-3xl">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-ink-900">
            Bildirimler
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500">
            Süreçlerdeki güncel durum ve aksiyon gerektiren maddeler.
          </p>
        </div>

        {notifications.length > 0 ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
            {notifications.map((n) => {
              const meta = META[n.kind];
              const Icon = meta.icon;
              return (
                <Link
                  key={n.id}
                  href={n.href}
                  className="flex items-center gap-4 border-b border-slate-100 px-5 py-4 transition-colors last:border-0 hover:bg-slate-50"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.bg} ${meta.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-semibold text-ink-900">
                      {n.title}
                    </p>
                    <p className="truncate text-[12.5px] text-ink-400">
                      {n.detail}
                    </p>
                  </div>
                  <span
                    className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium sm:block ${meta.bg} ${meta.color}`}
                  >
                    {meta.label}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-ink-300" />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <BellOff className="h-6 w-6" />
            </div>
            <p className="mt-3 text-[14px] font-medium text-ink-700">
              Bildirim yok
            </p>
            <p className="mt-1 text-[12.5px] text-ink-400">
              Tüm süreçler güncel görünüyor.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
