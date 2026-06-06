import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  CheckSquare,
  BarChart3,
  Bell,
  Settings,
  Building,
  RefreshCw,
  FileWarning,
  Hourglass,
  type LucideIcon,
} from "lucide-react";

export type StageStatus = "done" | "active" | "pending";
export type DocStatus = "Tamam" | "Eksik Evrak";

export type BadgeKey = "documents" | "approvals" | "notifications";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  badgeKey?: BadgeKey;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Binalar", icon: Building2, href: "/binalar" },
  { label: "Müteahhitler", icon: Users, href: "/muteahhitler" },
  { label: "Belgeler", icon: FileText, href: "/belgeler", badgeKey: "documents" },
  {
    label: "Onay Süreçleri",
    icon: CheckSquare,
    href: "/onay-surecleri",
    badgeKey: "approvals",
  },
  { label: "Raporlar", icon: BarChart3, href: "/raporlar" },
  {
    label: "Bildirimler",
    icon: Bell,
    href: "/bildirimler",
    badgeKey: "notifications",
  },
  { label: "Ayarlar", icon: Settings, href: "/ayarlar" },
];

export interface StatCard {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  tint: string;
  iconColor: string;
}

export const statCards: StatCard[] = [
  {
    label: "Toplam Proje",
    value: "128",
    delta: "12% geçen aya göre",
    icon: Building,
    tint: "bg-brand-50",
    iconColor: "text-brand-600",
  },
  {
    label: "Aktif Dönüşüm",
    value: "72",
    delta: "8% geçen aya göre",
    icon: RefreshCw,
    tint: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    label: "Eksik Evrak",
    value: "24",
    delta: "5% geçen aya göre",
    icon: FileWarning,
    tint: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    label: "Bekleyen Onay",
    value: "15",
    delta: "3% geçen aya göre",
    icon: Hourglass,
    tint: "bg-violet-50",
    iconColor: "text-violet-500",
  },
];

export type StageLabel =
  | "İnceleme"
  | "Belge Toplama"
  | "Onay"
  | "Yıkım"
  | "Yeniden Yapım";

export const stageStyles: Record<StageLabel, string> = {
  İnceleme: "bg-brand-50 text-brand-700",
  "Belge Toplama": "bg-emerald-50 text-emerald-700",
  Onay: "bg-violet-50 text-violet-700",
  Yıkım: "bg-orange-50 text-orange-700",
  "Yeniden Yapım": "bg-rose-50 text-rose-700",
};

export interface ProjectRow {
  id: string;
  name: string;
  image: string;
  district: string;
  contractor: string;
  stage: StageLabel;
  progress: number;
  progressColor: string;
  docStatus: DocStatus;
  updated: string;
  docTotal: number;
  docDone: number;
  missingDocs: string[];
}

export const projects: ProjectRow[] = [
  {
    id: "yildiz-park-evleri",
    name: "Yıldız Park Evleri",
    image: "/buildings/building-1.jpg",
    district: "Beşiktaş / İstanbul",
    contractor: "Mega Yapı A.Ş.",
    stage: "İnceleme",
    progress: 45,
    progressColor: "bg-brand-500",
    docStatus: "Eksik Evrak",
    updated: "21.05.2024",
    docTotal: 22,
    docDone: 15,
    missingDocs: [
      "Zemin Etüd Raporu",
      "Ruhsat Projesi (Mimari)",
      "Ruhsat Projesi (Statik)",
      "Hak Sahipliği Belgesi",
      "Emlak Beyan Formu",
      "Asansör Projesi",
      "Otopark Projesi",
    ],
  },
  {
    id: "gunesli-konutlari",
    name: "Güneşli Konutları",
    image: "/buildings/building-2.jpg",
    district: "Bağcılar / İstanbul",
    contractor: "Demir İnşaat",
    stage: "Belge Toplama",
    progress: 30,
    progressColor: "bg-emerald-500",
    docStatus: "Tamam",
    updated: "20.05.2024",
    docTotal: 18,
    docDone: 18,
    missingDocs: [],
  },
  {
    id: "koru-sitesi",
    name: "Koru Sitesi",
    image: "/buildings/building-3.jpg",
    district: "Üsküdar / İstanbul",
    contractor: "Yüksel Yapı",
    stage: "Onay",
    progress: 60,
    progressColor: "bg-violet-500",
    docStatus: "Eksik Evrak",
    updated: "19.05.2024",
    docTotal: 22,
    docDone: 19,
    missingDocs: ["İskan Belgesi", "Asansör Projesi", "Otopark Projesi"],
  },
  {
    id: "mavisehir-konaklari",
    name: "Mavişehir Konakları",
    image: "/buildings/building-5.jpg",
    district: "Beylikdüzü / İstanbul",
    contractor: "Yıldırım İnşaat",
    stage: "Yıkım",
    progress: 75,
    progressColor: "bg-orange-500",
    docStatus: "Tamam",
    updated: "18.05.2024",
    docTotal: 24,
    docDone: 24,
    missingDocs: [],
  },
  {
    id: "doga-rezidans",
    name: "Doğa Rezidans",
    image: "/buildings/building-6.jpg",
    district: "Kadıköy / İstanbul",
    contractor: "Doğa Yapı A.Ş.",
    stage: "Yeniden Yapım",
    progress: 40,
    progressColor: "bg-rose-500",
    docStatus: "Eksik Evrak",
    updated: "17.05.2024",
    docTotal: 20,
    docDone: 12,
    missingDocs: [
      "Zemin Etüd Raporu",
      "Ruhsat Projesi (Mimari)",
      "Ruhsat Projesi (Statik)",
      "Hak Sahipliği Belgesi",
      "Yapı Denetim Sözleşmesi",
      "Asansör Projesi",
      "Otopark Projesi",
      "Peyzaj Projesi",
    ],
  },
];

export interface TimelineStage {
  label: string;
  status: StageStatus;
  date?: string;
  hint: string;
  description: string;
}

export const timelineStages: TimelineStage[] = [
  {
    label: "Başvuru",
    status: "done",
    date: "01.03.2024",
    hint: "Tamamlandı",
    description:
      "Hak sahipleri kentsel dönüşüm için belediyeye resmi başvurusunu tamamlar.",
  },
  {
    label: "Belge Toplama",
    status: "done",
    date: "05.04.2024",
    hint: "Tamamlandı",
    description:
      "Tapu, kimlik, deprem risk raporu ve muvafakatname gibi evraklar toplanır.",
  },
  {
    label: "İnceleme",
    status: "active",
    date: "Devam Ediyor",
    hint: "Aktif",
    description:
      "Belediye teknik ekibi başvuruyu değerlendirir ve binayı yerinde inceler.",
  },
  {
    label: "Onay",
    status: "pending",
    hint: "Beklemede",
    description:
      "Dönüşüm kararı ve yıkım ruhsatı yetkili makamlarca onaylanır.",
  },
  {
    label: "Yıkım",
    status: "pending",
    hint: "Beklemede",
    description:
      "Riskli yapı, güvenlik tedbirleri alınarak kontrollü şekilde yıkılır.",
  },
  {
    label: "Yeniden Yapım",
    status: "pending",
    hint: "Beklemede",
    description:
      "Deprem yönetmeliğine uygun, modern ve dayanıklı yeni bina inşa edilir.",
  },
  {
    label: "Teslim",
    status: "pending",
    hint: "Beklemede",
    description:
      "Tamamlanan bağımsız bölümler hak sahiplerine teslim edilir.",
  },
];

export interface DonutSegment {
  label: string;
  value: number;
  percent: string;
  color: string;
}

export const donutSegments: DonutSegment[] = [
  { label: "Başvuru", value: 18, percent: "%14", color: "#2f6bff" },
  { label: "Belge Toplama", value: 24, percent: "%19", color: "#22c55e" },
  { label: "İnceleme", value: 30, percent: "%23", color: "#f97316" },
  { label: "Onay", value: 20, percent: "%16", color: "#8b5cf6" },
  { label: "Yıkım", value: 16, percent: "%12", color: "#f43f5e" },
  { label: "Yeniden Yapım", value: 12, percent: "%9", color: "#06b6d4" },
  { label: "Teslim", value: 8, percent: "%6", color: "#64748b" },
];

export const donutTotal = donutSegments.reduce((s, d) => s + d.value, 0);
