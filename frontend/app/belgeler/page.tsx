"use client";

import { useMemo, useState } from "react";
import {
  Users,
  ClipboardList,
  Stamp,
  Ruler,
  FileCheck2,
  Clock,
  FileWarning,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { useBuildings } from "@/components/BuildingsProvider";
import {
  documentCatalog,
  documentTotals,
  aggregateDocument,
  DOC_CATEGORIES,
  type DocCategory,
} from "@/lib/documents";

const CATEGORY_META: Record<
  DocCategory,
  { icon: LucideIcon; tint: string; iconColor: string; bar: string }
> = {
  "Hak Sahipliği": {
    icon: Users,
    tint: "bg-brand-50",
    iconColor: "text-brand-600",
    bar: "bg-brand-500",
  },
  "Teknik Raporlar": {
    icon: ClipboardList,
    tint: "bg-violet-50",
    iconColor: "text-violet-600",
    bar: "bg-violet-500",
  },
  "Ruhsat & İmar": {
    icon: Stamp,
    tint: "bg-emerald-50",
    iconColor: "text-emerald-600",
    bar: "bg-emerald-500",
  },
  Projeler: {
    icon: Ruler,
    tint: "bg-orange-50",
    iconColor: "text-orange-600",
    bar: "bg-orange-500",
  },
};

export default function BelgelerPage() {
  const { buildings } = useBuildings();
  const [category, setCategory] = useState<DocCategory | "Tümü">("Tümü");

  const totals = useMemo(() => documentTotals(buildings), [buildings]);

  const visible = useMemo(
    () =>
      category === "Tümü"
        ? documentCatalog
        : documentCatalog.filter((d) => d.category === category),
    [category],
  );

  return (
    <main className="scroll-thin min-w-0 flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-ink-900">
            Belgeler
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500">
            Kentsel dönüşüm sürecinde talep edilen belge türleri ve binalardaki
            güncel durumları.
          </p>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <SummaryCard
            label="Belge Türü"
            value={documentCatalog.length}
            icon={Layers}
            tint="bg-slate-100"
            iconColor="text-ink-500"
          />
          <SummaryCard
            label="Onaylanan"
            value={totals.approved}
            icon={FileCheck2}
            tint="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <SummaryCard
            label="Onay Bekleyen"
            value={totals.pending}
            icon={Clock}
            tint="bg-amber-50"
            iconColor="text-amber-600"
          />
          <SummaryCard
            label="Eksik"
            value={totals.missing}
            icon={FileWarning}
            tint="bg-rose-50"
            iconColor="text-rose-600"
          />
        </div>

        {/* Category tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          <CategoryTab
            label="Tümü"
            active={category === "Tümü"}
            onClick={() => setCategory("Tümü")}
          />
          {DOC_CATEGORIES.map((c) => (
            <CategoryTab
              key={c}
              label={c}
              active={category === c}
              onClick={() => setCategory(c)}
            />
          ))}
        </div>

        {/* Document cards */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((doc) => {
            const agg = aggregateDocument(buildings, doc.name);
            const meta = CATEGORY_META[doc.category];
            const Icon = meta.icon;
            const total = agg.approved + agg.pending + agg.missing;
            return (
              <div
                key={doc.name}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${meta.tint} ${meta.iconColor}`}
                  >
                    <Icon className="h-[22px] w-[22px]" />
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      doc.required
                        ? "bg-rose-50 text-rose-600"
                        : "bg-slate-100 text-ink-500"
                    }`}
                  >
                    {doc.required ? "Zorunlu" : "Opsiyonel"}
                  </span>
                </div>

                <h3 className="mt-3.5 text-[15px] font-bold tracking-tight text-ink-900">
                  {doc.name}
                </h3>
                <p className="mt-1 text-[11.5px] font-medium text-ink-400">
                  {doc.category}
                </p>
                <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-ink-500">
                  {doc.description}
                </p>

                {/* Aggregate bar */}
                <div className="mt-4">
                  {total > 0 ? (
                    <>
                      <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        {agg.approved > 0 && (
                          <div
                            className="h-full bg-emerald-500"
                            style={{ width: `${(agg.approved / total) * 100}%` }}
                          />
                        )}
                        {agg.pending > 0 && (
                          <div
                            className="h-full bg-amber-400"
                            style={{ width: `${(agg.pending / total) * 100}%` }}
                          />
                        )}
                        {agg.missing > 0 && (
                          <div
                            className="h-full bg-rose-400"
                            style={{ width: `${(agg.missing / total) * 100}%` }}
                          />
                        )}
                      </div>
                      <div className="mt-2.5 flex items-center justify-between text-[11.5px]">
                        <span className="flex items-center gap-3">
                          <Legend color="bg-emerald-500" value={agg.approved} />
                          <Legend color="bg-amber-400" value={agg.pending} />
                          <Legend color="bg-rose-400" value={agg.missing} />
                        </span>
                        <span className="text-ink-400">{total} binada</span>
                      </div>
                    </>
                  ) : (
                    <p className="rounded-lg bg-slate-50 px-3 py-2 text-[12px] text-ink-400">
                      Henüz hiçbir binada talep edilmedi.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  tint,
  iconColor,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  tint: string;
  iconColor: string;
}) {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tint} ${iconColor}`}
      >
        <Icon className="h-[22px] w-[22px]" />
      </div>
      <div className="leading-tight">
        <p className="text-[22px] font-bold text-ink-900">{value}</p>
        <p className="text-[12px] text-ink-500">{label}</p>
      </div>
    </div>
  );
}

function CategoryTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-xl border px-3.5 py-2 text-[13px] font-medium transition-colors",
        active
          ? "border-brand-300 bg-brand-50 text-brand-700"
          : "border-slate-200 bg-white text-ink-600 hover:bg-slate-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function Legend({ color, value }: { color: string; value: number }) {
  return (
    <span className="flex items-center gap-1 text-ink-500">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {value}
    </span>
  );
}
