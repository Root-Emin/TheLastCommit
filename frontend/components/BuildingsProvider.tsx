"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  type Building,
  type NewBuildingInput,
  createBuilding,
  seedBuildings,
  computeProgress,
  nextStatus,
} from "@/lib/buildings";

const STORAGE_KEY = "parseltakip.buildings.v1";

interface BuildingsContextValue {
  buildings: Building[];
  getBuilding: (id: string) => Building | undefined;
  addBuilding: (input: NewBuildingInput) => Building;
  assignContractor: (id: string, name: string) => void;
  markDocumentUploaded: (id: string, docName: string) => void;
  approveDocument: (id: string, docName: string) => void;
  advanceStatus: (id: string) => void;
  resetBuildings: () => void;
}

const BuildingsContext = createContext<BuildingsContextValue | null>(null);

export function BuildingsProvider({ children }: { children: React.ReactNode }) {
  const [buildings, setBuildings] = useState<Building[]>(seedBuildings);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setBuildings(JSON.parse(raw) as Building[]);
    } catch {
      // ignore corrupted storage
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(buildings));
    } catch {
      // storage may be unavailable
    }
  }, [buildings]);

  const getBuilding = useCallback(
    (id: string) => buildings.find((b) => b.id === id),
    [buildings],
  );

  const addBuilding = useCallback((input: NewBuildingInput) => {
    const next = createBuilding(input);
    setBuildings((prev) => [next, ...prev]);
    return next;
  }, []);

  const assignContractor = useCallback((id: string, name: string) => {
    setBuildings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, contractor: name } : b)),
    );
  }, []);

  const markDocumentUploaded = useCallback((id: string, docName: string) => {
    setBuildings((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const documents = b.documents.map((d) =>
          d.name === docName
            ? {
                ...d,
                status: "Onay Bekliyor" as const,
                uploadedBy: "Ahmet Yılmaz",
                date: new Date().toISOString().slice(0, 10),
              }
            : d,
        );
        return { ...b, documents, progress: computeProgress(b.status, documents) };
      }),
    );
  }, []);

  const approveDocument = useCallback((id: string, docName: string) => {
    setBuildings((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const documents = b.documents.map((d) =>
          d.name === docName
            ? { ...d, status: "Onaylandı" as const }
            : d,
        );
        return { ...b, documents, progress: computeProgress(b.status, documents) };
      }),
    );
  }, []);

  const advanceStatus = useCallback((id: string) => {
    setBuildings((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const status = nextStatus(b.status);
        return { ...b, status, progress: computeProgress(status, b.documents) };
      }),
    );
  }, []);

  const resetBuildings = useCallback(() => {
    setBuildings(seedBuildings);
  }, []);

  return (
    <BuildingsContext.Provider
      value={{
        buildings,
        getBuilding,
        addBuilding,
        assignContractor,
        markDocumentUploaded,
        approveDocument,
        advanceStatus,
        resetBuildings,
      }}
    >
      {children}
    </BuildingsContext.Provider>
  );
}

export function useBuildings() {
  const ctx = useContext(BuildingsContext);
  if (!ctx) {
    throw new Error("useBuildings must be used within BuildingsProvider");
  }
  return ctx;
}
