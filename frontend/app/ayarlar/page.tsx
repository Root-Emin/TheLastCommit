"use client";

import { useState } from "react";
import { Mail, Briefcase, Building2, RotateCcw, Check } from "lucide-react";
import { useBuildings } from "@/components/BuildingsProvider";
import { useContractors } from "@/components/ContractorsProvider";

export default function AyarlarPage() {
  const { resetBuildings } = useBuildings();
  const { resetContractors } = useContractors();

  const [prefs, setPrefs] = useState({
    email: true,
    approvals: true,
    weekly: false,
  });
  const [resetDone, setResetDone] = useState(false);

  function handleReset() {
    if (
      window.confirm(
        "Tüm bina ve müteahhit verileri başlangıç durumuna döndürülecek. Devam edilsin mi?",
      )
    ) {
      resetBuildings();
      resetContractors();
      setResetDone(true);
      window.setTimeout(() => setResetDone(false), 2500);
    }
  }

  return (
    <main className="scroll-thin min-w-0 flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-3xl">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-ink-900">
            Ayarlar
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500">
            Hesap bilgileriniz ve uygulama tercihleri.
          </p>
        </div>

        {/* Profile */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="text-[15px] font-semibold text-ink-900">Profil</h2>
          <div className="mt-4 flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/avatar.jpg"
              alt="Ahmet Yılmaz"
              className="h-16 w-16 rounded-2xl object-cover ring-1 ring-slate-200"
            />
            <div>
              <p className="text-[16px] font-bold text-ink-900">Ahmet Yılmaz</p>
              <p className="text-[13px] text-ink-500">Proje Yöneticisi</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow icon={Mail} label="E-posta" value="ahmet.yilmaz@ibb.gov.tr" />
            <InfoRow icon={Briefcase} label="Rol" value="Proje Yöneticisi" />
            <InfoRow
              icon={Building2}
              label="Kurum"
              value="İstanbul Büyükşehir Belediyesi"
            />
          </div>
        </section>

        {/* Notification prefs */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="text-[15px] font-semibold text-ink-900">
            Bildirim Tercihleri
          </h2>
          <div className="mt-3 divide-y divide-slate-100">
            <Toggle
              label="E-posta bildirimleri"
              hint="Önemli güncellemeler e-posta ile gönderilsin."
              checked={prefs.email}
              onChange={() => setPrefs((p) => ({ ...p, email: !p.email }))}
            />
            <Toggle
              label="Onay hatırlatmaları"
              hint="Onay bekleyen belgeler için hatırlatma al."
              checked={prefs.approvals}
              onChange={() =>
                setPrefs((p) => ({ ...p, approvals: !p.approvals }))
              }
            />
            <Toggle
              label="Haftalık özet"
              hint="Her hafta portföy özeti gönderilsin."
              checked={prefs.weekly}
              onChange={() => setPrefs((p) => ({ ...p, weekly: !p.weekly }))}
            />
          </div>
        </section>

        {/* Data management */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="text-[15px] font-semibold text-ink-900">
            Veri Yönetimi
          </h2>
          <p className="mt-1 text-[12.5px] text-ink-500">
            Demo verilerini (binalar ve müteahhitler) başlangıç durumuna
            döndürün. Bu işlem geri alınamaz.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className={[
              "mt-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-colors",
              resetDone
                ? "bg-emerald-600 text-white"
                : "border border-rose-200 bg-white text-rose-600 hover:bg-rose-50",
            ].join(" ")}
          >
            {resetDone ? (
              <>
                <Check className="h-4 w-4" />
                Veriler sıfırlandı
              </>
            ) : (
              <>
                <RotateCcw className="h-4 w-4" />
                Demo verilerini sıfırla
              </>
            )}
          </button>
        </section>
      </div>
    </main>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3.5 py-3">
      <Icon className="h-4 w-4 shrink-0 text-ink-400" />
      <div className="min-w-0">
        <p className="text-[11px] text-ink-400">{label}</p>
        <p className="truncate text-[13px] font-medium text-ink-900">{value}</p>
      </div>
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <p className="text-[13.5px] font-medium text-ink-900">{label}</p>
        <p className="text-[12px] text-ink-400">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={[
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-brand-500" : "bg-slate-200",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
            checked ? "left-[22px]" : "left-0.5",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
