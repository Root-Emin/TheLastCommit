"use client";

import { useMemo } from "react";
import {
  Building,
  TrendingUp,
  CheckCircle2,
  HardHat,
  type LucideIcon,
} from "lucide-react";
import { useBuildings } from "@/components/BuildingsProvider";
import { useContractors } from "@/components/ContractorsProvider";
import { ALL_STATUSES, STATUS_BADGE } from "@/lib/buildings";
import { documentTotals } from "@/lib/documents";
import { activeProjectCount } from "@/lib/contractors";

export default function RaporlarPage() {
  const { buildings } = useBuildings();
  const { contractors } = useContractors();

  const metrics = useMemo(() => {
    const total = buildings.length;
    const avg = total
      ? Math.round(buildings.reduce((s, b) => s + b.progress, 0) / total)
      : 0;
    const delivered = buildings.filter(
      (b) => b.status === "Teslim Edildi",
    ).length;
    return { total, avg, delivered };
  }, [buildings]);

  const statusDist = useMemo(
    () =>
      ALL_STATUSES.map((s) => ({
        status: s,
        count: buildings.filter((b) => b.status === s).length,
      })),
    [buildings],
  );
  const maxStatus = Math.max(1, ...statusDist.map((s) => s.count));

  const docs = useMemo(() => documentTotals(buildings), [buildings]);

  const workload = useMemo(
    () =>
      contractors
        .map((c) => ({
          name: c.name,
          active: activeProjectCount(buildings, c.name),
        }))
        .sort((a, b) => b.active - a.active)
        .slice(0, 6),
    [contractors, buildings],
  );
  const maxLoad = Math.max(1, ...workload.map((w) => w.active));

  return (
    <main className="scroll-thin min-w-0 flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-6xl">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-ink-900">
            Raporlar
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500">
            Kentsel dönüşüm portföyünün genel görünümü ve istatistikleri.
          </p>
        </div>

        {/* Metrics */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric
            label="Toplam Bina"
            value={`${metrics.total}`}
            icon={Building}
            tint="bg-brand-50"
            iconColor="text-brand-600"
          />
          <Metric
            label="Ortalama İlerleme"
            value={`%${metrics.avg}`}
            icon={TrendingUp}
            tint="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <Metric
            label="Teslim Edilen"
            value={`${metrics.delivered}`}
            icon={CheckCircle2}
            tint="bg-violet-50"
            iconColor="text-violet-600"
          />
          <Metric
            label="Müteahhit"
            value={`${contractors.length}`}
            icon={HardHat}
            tint="bg-orange-50"
            iconColor="text-orange-600"
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Status distribution */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="text-[15px] font-semibold text-ink-900">
              Aşamalara Göre Dağılım
            </h2>
            <div className="mt-5 space-y-3.5">
              {statusDist.map((s) => (
                <div key={s.status}>
                  <div className="flex items-center justify-between text-[12.5px]">
                    <span className="text-ink-600">{s.status}</span>
                    <span className="font-semibold text-ink-900">{s.count}</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${STATUS_BADGE[s.status]}`}
                      style={{ width: `${(s.count / maxStatus) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Document health */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h2 className="text-[15px] font-semibold text-ink-900">
              Belge Sağlığı
            </h2>
            <p className="mt-1 text-[12.5px] text-ink-400">
              Tüm binalardaki {docs.total} belge örneği.
            </p>
            <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <Bar value={docs.approved} total={docs.total} color="bg-emerald-500" />
              <Bar value={docs.pending} total={docs.total} color="bg-amber-400" />
              <Bar value={docs.missing} total={docs.total} color="bg-rose-400" />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <DocStat label="Onaylı" value={docs.approved} color="bg-emerald-500" />
              <DocStat label="Bekleyen" value={docs.pending} color="bg-amber-400" />
              <DocStat label="Eksik" value={docs.missing} color="bg-rose-400" />
            </div>
          </section>

          {/* Contractor workload */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-2">
            <h2 className="text-[15px] font-semibold text-ink-900">
              Müteahhit Yükü (Aktif Proje)
            </h2>
            {workload.length > 0 ? (
              <div className="mt-5 space-y-3.5">
                {workload.map((w) => (
                  <div key={w.name} className="flex items-center gap-3">
                    <span className="w-40 shrink-0 truncate text-[12.5px] text-ink-700">
                      {w.name}
                    </span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${(w.active / maxLoad) * 100}%` }}
                      />
                    </div>
                    <span className="w-6 shrink-0 text-right text-[12.5px] font-semibold text-ink-900">
                      {w.active}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-[13px] text-ink-400">
                Henüz müteahhit verisi yok.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
  tint,
  iconColor,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tint: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${tint} ${iconColor}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-[24px] font-bold leading-none text-ink-900">
        {value}
      </p>
      <p className="mt-1.5 text-[12.5px] text-ink-500">{label}</p>
    </div>
  );
}

function Bar({
  value,
  total,
  color,
}: {
  value: number;
  total: number;
  color: string;
}) {
  if (value <= 0) return null;
  return (
    <div className={`h-full ${color}`} style={{ width: `${(value / total) * 100}%` }} />
  );
}

function DocStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5">
      <span className="flex items-center gap-1.5 text-[11.5px] text-ink-500">
        <span className={`h-2 w-2 rounded-full ${color}`} />
        {label}
      </span>
      <p className="mt-1 text-[18px] font-bold text-ink-900">{value}</p>
    </div>
  );
}
