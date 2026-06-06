import { type Building } from "@/lib/buildings";

export type NotificationKind = "approval" | "missing" | "unassigned" | "delivered";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  detail: string;
  href: string;
}

function preview(names: string[]): string {
  const head = names.slice(0, 2).join(", ");
  return names.length > 2 ? `${head} +${names.length - 2} diğer` : head;
}

/** Bina verisinden canlı bildirim listesi türetir. */
export function buildNotifications(buildings: Building[]): AppNotification[] {
  const notes: AppNotification[] = [];

  for (const b of buildings) {
    const pending = b.documents.filter((d) => d.status === "Onay Bekliyor");
    const missing = b.documents.filter((d) => d.status === "Yüklenmedi");

    if (pending.length > 0) {
      notes.push({
        id: `appr-${b.id}`,
        kind: "approval",
        title: `${b.name} — ${pending.length} belge onay bekliyor`,
        detail: preview(pending.map((d) => d.name)),
        href: "/onay-surecleri",
      });
    }

    if (missing.length > 0) {
      notes.push({
        id: `miss-${b.id}`,
        kind: "missing",
        title: `${b.name} — ${missing.length} eksik belge`,
        detail: preview(missing.map((d) => d.name)),
        href: `/binalar/${b.id}`,
      });
    }

    if (b.status !== "Teslim Edildi" && !b.contractor) {
      notes.push({
        id: `noc-${b.id}`,
        kind: "unassigned",
        title: `${b.name} — müteahhit atanmadı`,
        detail: "Sürecin ilerlemesi için müteahhit ataması yapın.",
        href: `/binalar/${b.id}`,
      });
    }

    if (b.status === "Teslim Edildi") {
      notes.push({
        id: `done-${b.id}`,
        kind: "delivered",
        title: `${b.name} teslim edildi`,
        detail: "Dönüşüm süreci başarıyla tamamlandı.",
        href: `/binalar/${b.id}`,
      });
    }
  }

  const order: Record<NotificationKind, number> = {
    approval: 0,
    missing: 1,
    unassigned: 2,
    delivered: 3,
  };
  return notes.sort((a, b) => order[a.kind] - order[b.kind]);
}
