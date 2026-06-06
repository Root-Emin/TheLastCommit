"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Clock, Check, MapPin, Inbox, FileText } from "lucide-react";
import { useBuildings } from "@/components/BuildingsProvider";
import { pendingApprovals } from "@/lib/documents";

export default function OnaySurecleriPage() {
  const { buildings, approveDocument } = useBuildings();

  const queue = useMemo(() => pendingApprovals(buildings), [buildings]);

  return (
    <main className="scroll-thin min-w-0 flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[24px] font-bold tracking-tight text-ink-900">
              Onay Süreçleri
            </h1>
            <p className="mt-1 text-[13.5px] text-ink-500">
              Yüklenmiş ve onay bekleyen belgeleri inceleyip onaylayın.
            </p>
          </div>
          <span className="flex items-center gap-2 rounded-xl bg-amber-50 px-3.5 py-2 text-[13px] font-semibold text-amber-700">
            <Clock className="h-4 w-4" />
            {queue.length} bekleyen onay
          </span>
        </div>

        {/* Queue */}
        {queue.length > 0 ? (
          <div className="mt-6 space-y-3">
            {queue.map(({ buildingId, buildingName, district, doc }) => (
              <div
                key={`${buildingId}-${doc.name}`}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <FileText className="h-[22px] w-[22px]" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-ink-900">
                    {doc.name}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-ink-400">
                    <Link
                      href={`/binalar/${buildingId}`}
                      className="flex items-center gap-1 font-medium text-brand-600 hover:text-brand-700"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      {buildingName}
                    </Link>
                    <span>{district}</span>
                    {doc.uploadedBy && (
                      <span>
                        {doc.uploadedBy} • {doc.date}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => approveDocument(buildingId, doc.name)}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-[13px] font-semibold text-white shadow-soft transition-colors hover:bg-emerald-700"
                >
                  <Check className="h-4 w-4" />
                  Onayla
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
              <Inbox className="h-6 w-6" />
            </div>
            <p className="mt-3 text-[14px] font-medium text-ink-700">
              Onay bekleyen belge yok
            </p>
            <p className="mt-1 text-[12.5px] text-ink-400">
              Bir binada belge yüklendiğinde burada onayınızı bekler.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
