import {
  FileText,
  FolderOpen,
  Search,
  CheckCircle2,
  Hammer,
  Building2,
  PackageCheck,
  Check,
  type LucideIcon,
} from "lucide-react";
import { timelineStages } from "@/lib/data";

const icons: LucideIcon[] = [
  FileText,
  FolderOpen,
  Search,
  CheckCircle2,
  Hammer,
  Building2,
  PackageCheck,
];

const statusBadge = {
  done: { label: "Tamamlandı", cls: "bg-emerald-50 text-emerald-600" },
  active: { label: "Devam Ediyor", cls: "bg-brand-50 text-brand-700" },
  pending: { label: "Beklemede", cls: "bg-slate-100 text-ink-400" },
} as const;

export default function ProcessTimeline() {
  const doneCount = timelineStages.filter((s) => s.status === "done").length;
  const total = timelineStages.length;
  const percent = Math.round((doneCount / total) * 100);

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-ink-900">
            Dönüşüm Süreci Aşamaları
          </h2>
          <p className="mt-0.5 text-[12px] text-ink-400">
            Bir projenin kentsel dönüşüm yolculuğundaki 7 resmi adım.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-slate-50 px-2.5 py-1 text-[11.5px] font-semibold text-ink-700">
          {doneCount}/{total} aşama
        </span>
      </div>

      {/* Progress summary bar */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Vertical timeline */}
      <ol className="mt-5">
        {timelineStages.map((stage, i) => {
          const Icon = icons[i];
          const isLast = i === timelineStages.length - 1;
          const done = stage.status === "done";
          const active = stage.status === "active";

          return (
            <li key={stage.label} className="relative flex gap-3.5 pb-5 last:pb-0">
              {/* Connector */}
              {!isLast && (
                <span
                  className={[
                    "absolute left-[17px] top-9 h-[calc(100%-2.25rem)] w-0.5 rounded-full",
                    done ? "bg-emerald-300" : "bg-slate-200",
                  ].join(" ")}
                />
              )}

              {/* Node */}
              <div
                className={[
                  "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all",
                  active
                    ? "bg-brand-500 text-white ring-4 ring-brand-100"
                    : done
                      ? "bg-emerald-500 text-white"
                      : "border border-slate-200 bg-white text-ink-400",
                ].join(" ")}
              >
                {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>

              {/* Content */}
              <div className="flex-1 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={[
                      "text-[13.5px] font-semibold",
                      active ? "text-brand-700" : "text-ink-900",
                    ].join(" ")}
                  >
                    {stage.label}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10.5px] font-medium ${statusBadge[stage.status].cls}`}
                  >
                    {statusBadge[stage.status].label}
                  </span>
                  {stage.date && (
                    <span className="text-[11px] text-ink-400">
                      {stage.status === "active" ? "" : stage.date}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-500">
                  {stage.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
