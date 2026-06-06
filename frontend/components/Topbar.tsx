"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  ChevronDown,
  Building2,
  Users,
  Clock,
  FileWarning,
  CheckCircle2,
  UserPlus,
  Settings,
  LogOut,
  CornerDownLeft,
  type LucideIcon,
} from "lucide-react";
import { useBuildings } from "@/components/BuildingsProvider";
import { useContractors } from "@/components/ContractorsProvider";
import { buildNotifications, type NotificationKind } from "@/lib/notifications";

type Menu = "notif" | "profile" | null;

const NOTIF_ICON: Record<
  NotificationKind,
  { icon: LucideIcon; color: string; bg: string }
> = {
  approval: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  missing: { icon: FileWarning, color: "text-rose-600", bg: "bg-rose-50" },
  unassigned: { icon: UserPlus, color: "text-violet-600", bg: "bg-violet-50" },
  delivered: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
};

export default function Topbar() {
  const { buildings } = useBuildings();
  const { contractors } = useContractors();
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [menu, setMenu] = useState<Menu>(null);
  const rootRef = useRef<HTMLElement>(null);

  const notifications = useMemo(
    () => buildNotifications(buildings),
    [buildings],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { buildings: [], contractors: [] };
    return {
      buildings: buildings
        .filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            b.district.toLowerCase().includes(q) ||
            b.address.toLowerCase().includes(q),
        )
        .slice(0, 5),
      contractors: contractors
        .filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.contactPerson.toLowerCase().includes(q),
        )
        .slice(0, 4),
    };
  }, [query, buildings, contractors]);

  const hasResults =
    results.buildings.length > 0 || results.contractors.length > 0;
  const searchOpen = searchFocused && query.trim().length > 0;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setMenu(null);
        setSearchFocused(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenu(null);
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function closeSearch() {
    setQuery("");
    setSearchFocused(false);
  }

  return (
    <header
      ref={rootRef}
      className="relative z-30 flex h-[68px] shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-6"
    >
      <div className="min-w-0">
        <h1 className="truncate text-[17px] font-bold tracking-tight text-ink-900">
          Hoş geldiniz, Ahmet Yılmaz <span className="font-normal">👋</span>
        </h1>
      </div>

      {/* Global search */}
      <div className="mx-auto hidden w-full max-w-md md:block">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setSearchFocused(true);
              setMenu(null);
            }}
            placeholder="Bina, proje, müteahhit ara..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-4 text-[13px] text-ink-900 placeholder:text-ink-400 outline-none transition-colors focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100"
          />

          {searchOpen && (
            <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-soft">
              {hasResults ? (
                <>
                  {results.buildings.length > 0 && (
                    <Section title="Binalar">
                      {results.buildings.map((b) => (
                        <ResultRow
                          key={b.id}
                          href={`/binalar/${b.id}`}
                          icon={Building2}
                          title={b.name}
                          subtitle={`${b.district} • ${b.status}`}
                          onClick={closeSearch}
                        />
                      ))}
                    </Section>
                  )}
                  {results.contractors.length > 0 && (
                    <Section title="Müteahhitler">
                      {results.contractors.map((c) => (
                        <ResultRow
                          key={c.id}
                          href={`/muteahhitler/${c.id}`}
                          icon={Users}
                          title={c.name}
                          subtitle={c.contactPerson}
                          onClick={closeSearch}
                        />
                      ))}
                    </Section>
                  )}
                </>
              ) : (
                <p className="px-4 py-6 text-center text-[12.5px] text-ink-400">
                  &quot;{query}&quot; için sonuç bulunamadı.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            aria-label="Bildirimler"
            onClick={() => setMenu((m) => (m === "notif" ? null : "notif"))}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-ink-500 transition-colors hover:bg-slate-50"
          >
            <Bell className="h-[18px] w-[18px]" />
            {notifications.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white ring-2 ring-white">
                {notifications.length}
              </span>
            )}
          </button>

          {menu === "notif" && (
            <div className="absolute right-0 top-full z-40 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <p className="text-[13.5px] font-semibold text-ink-900">
                  Bildirimler
                </p>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-ink-500">
                  {notifications.length}
                </span>
              </div>
              <div className="scroll-thin max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.slice(0, 6).map((n) => {
                    const meta = NOTIF_ICON[n.kind];
                    const Icon = meta.icon;
                    return (
                      <Link
                        key={n.id}
                        href={n.href}
                        onClick={() => setMenu(null)}
                        className="flex gap-3 border-b border-slate-50 px-4 py-3 transition-colors last:border-0 hover:bg-slate-50"
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.bg} ${meta.color}`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[12.5px] font-medium text-ink-900">
                            {n.title}
                          </span>
                          <span className="block truncate text-[11.5px] text-ink-400">
                            {n.detail}
                          </span>
                        </span>
                      </Link>
                    );
                  })
                ) : (
                  <p className="px-4 py-8 text-center text-[12.5px] text-ink-400">
                    Yeni bildirim yok.
                  </p>
                )}
              </div>
              <Link
                href="/bildirimler"
                onClick={() => setMenu(null)}
                className="block border-t border-slate-100 px-4 py-2.5 text-center text-[12.5px] font-medium text-brand-600 transition-colors hover:bg-brand-50"
              >
                Tüm bildirimleri gör
              </Link>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenu((m) => (m === "profile" ? null : "profile"))}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-slate-50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/avatar.jpg"
              alt="Ahmet Yılmaz"
              className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200"
            />
            <div className="hidden leading-tight sm:block">
              <p className="text-[12.5px] font-semibold text-ink-900">
                Ahmet Yılmaz
              </p>
              <p className="text-[10.5px] text-ink-400">Proje Yöneticisi</p>
            </div>
            <ChevronDown className="h-4 w-4 text-ink-400" />
          </button>

          {menu === "profile" && (
            <div className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-soft">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-[13px] font-semibold text-ink-900">
                  Ahmet Yılmaz
                </p>
                <p className="text-[11.5px] text-ink-400">
                  ahmet.yilmaz@ibb.gov.tr
                </p>
              </div>
              <Link
                href="/ayarlar"
                onClick={() => setMenu(null)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-ink-700 transition-colors hover:bg-slate-50"
              >
                <Settings className="h-4 w-4 text-ink-400" />
                Ayarlar
              </Link>
              <button
                type="button"
                onClick={() => setMenu(null)}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] text-rose-600 transition-colors hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" />
                Çıkış Yap
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-1">
      <p className="px-4 py-1 text-[10.5px] font-semibold uppercase tracking-wide text-ink-400">
        {title}
      </p>
      {children}
    </div>
  );
}

function ResultRow({
  href,
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-slate-50"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-ink-500">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium text-ink-900">
          {title}
        </span>
        <span className="block truncate text-[11.5px] text-ink-400">
          {subtitle}
        </span>
      </span>
      <CornerDownLeft className="h-3.5 w-3.5 text-ink-300" />
    </Link>
  );
}
