import { type Building, type BuildingDoc } from "@/lib/buildings";

export type DocCategory =
  | "Hak Sahipliği"
  | "Teknik Raporlar"
  | "Ruhsat & İmar"
  | "Projeler";

export const DOC_CATEGORIES: DocCategory[] = [
  "Hak Sahipliği",
  "Teknik Raporlar",
  "Ruhsat & İmar",
  "Projeler",
];

export interface DocType {
  name: string;
  category: DocCategory;
  description: string;
  required: boolean;
}

/** Kentsel dönüşüm sürecinde talep edilen belge kataloğu. */
export const documentCatalog: DocType[] = [
  {
    name: "Tapu Fotokopisi",
    category: "Hak Sahipliği",
    description: "Bağımsız bölüm maliklerinin güncel tapu kayıt örneği.",
    required: true,
  },
  {
    name: "Kimlik Fotokopisi",
    category: "Hak Sahipliği",
    description: "Tüm hak sahiplerine ait T.C. kimlik belgesi sureti.",
    required: true,
  },
  {
    name: "Muvafakatname",
    category: "Hak Sahipliği",
    description: "Maliklerin dönüşüm sürecine onay verdiğini gösteren belge.",
    required: true,
  },
  {
    name: "Vekaletname",
    category: "Hak Sahipliği",
    description: "Hak sahibi adına işlem yapacak vekile ait noter onaylı belge.",
    required: true,
  },
  {
    name: "Deprem Risk Raporu",
    category: "Teknik Raporlar",
    description: "Binanın riskli yapı olduğunu belgeleyen teknik analiz raporu.",
    required: true,
  },
  {
    name: "Zemin Etüdü",
    category: "Teknik Raporlar",
    description: "Parselin zemin yapısını ve taşıma kapasitesini belirleyen etüt.",
    required: true,
  },
  {
    name: "Aplikasyon Krokisi",
    category: "Teknik Raporlar",
    description: "Parselin arazideki konumunu gösteren kadastro krokisi.",
    required: true,
  },
  {
    name: "Yapı Ruhsatı",
    category: "Ruhsat & İmar",
    description: "Belediye tarafından düzenlenen inşaat izni belgesi.",
    required: true,
  },
  {
    name: "İmar Durumu",
    category: "Ruhsat & İmar",
    description: "Parselin imar planındaki yapılaşma koşullarını gösteren belge.",
    required: true,
  },
  {
    name: "Numarataj Belgesi",
    category: "Ruhsat & İmar",
    description: "Yapının resmi adres ve numara bilgisini içeren belge.",
    required: true,
  },
  {
    name: "İnşaat Ruhsatı",
    category: "Ruhsat & İmar",
    description: "Yeni yapının inşaatına başlanabilmesi için gerekli ruhsat.",
    required: false,
  },
  {
    name: "İskan Belgesi",
    category: "Ruhsat & İmar",
    description: "Tamamlanan yapının kullanıma uygun olduğunu gösteren belge.",
    required: false,
  },
  {
    name: "Statik Proje",
    category: "Projeler",
    description: "Yapının taşıyıcı sistemini tanımlayan mühendislik projesi.",
    required: false,
  },
  {
    name: "Mekanik Proje",
    category: "Projeler",
    description: "Isıtma, sıhhi tesisat ve havalandırma sistemleri projesi.",
    required: false,
  },
  {
    name: "Elektrik Projesi",
    category: "Projeler",
    description: "Yapının elektrik tesisat ve dağıtım sistemleri projesi.",
    required: false,
  },
];

export interface DocAggregate {
  approved: number;
  pending: number;
  missing: number;
  buildings: number;
}

/** Bir belge türünün tüm binalardaki durum dağılımını çıkarır. */
export function aggregateDocument(
  buildings: Building[],
  name: string,
): DocAggregate {
  let approved = 0;
  let pending = 0;
  let missing = 0;
  let count = 0;
  for (const b of buildings) {
    const doc = b.documents.find((d) => d.name === name);
    if (!doc) continue;
    count += 1;
    if (doc.status === "Onaylandı") approved += 1;
    else if (doc.status === "Onay Bekliyor") pending += 1;
    else missing += 1;
  }
  return { approved, pending, missing, buildings: count };
}

export interface DocTotals {
  approved: number;
  pending: number;
  missing: number;
  total: number;
}

export function documentTotals(buildings: Building[]): DocTotals {
  let approved = 0;
  let pending = 0;
  let missing = 0;
  for (const b of buildings) {
    for (const d of b.documents) {
      if (d.status === "Onaylandı") approved += 1;
      else if (d.status === "Onay Bekliyor") pending += 1;
      else missing += 1;
    }
  }
  return { approved, pending, missing, total: approved + pending + missing };
}

export interface PendingApproval {
  buildingId: string;
  buildingName: string;
  district: string;
  doc: BuildingDoc;
}

/** Tüm binalarda onay bekleyen belgeleri tek listede toplar. */
export function pendingApprovals(buildings: Building[]): PendingApproval[] {
  const out: PendingApproval[] = [];
  for (const b of buildings) {
    for (const d of b.documents) {
      if (d.status === "Onay Bekliyor") {
        out.push({
          buildingId: b.id,
          buildingName: b.name,
          district: b.district,
          doc: d,
        });
      }
    }
  }
  return out;
}

export function pendingApprovalCount(buildings: Building[]): number {
  return buildings.reduce(
    (sum, b) =>
      sum + b.documents.filter((d) => d.status === "Onay Bekliyor").length,
    0,
  );
}

export function missingDocCount(buildings: Building[]): number {
  return buildings.reduce(
    (sum, b) =>
      sum + b.documents.filter((d) => d.status === "Yüklenmedi").length,
    0,
  );
}
