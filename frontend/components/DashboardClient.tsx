"use client";

import { useState } from "react";
import StatCards from "@/components/StatCards";
import ProjectTable from "@/components/ProjectTable";
import ProcessTimeline from "@/components/ProcessTimeline";
import StatusDonut from "@/components/StatusDonut";
import DetailPanel from "@/components/DetailPanel";
import { projects } from "@/lib/data";

export default function DashboardClient() {
  const [selectedId, setSelectedId] = useState<string | null>(projects[0].id);
  const selected = projects.find((p) => p.id === selectedId) ?? null;

  return (
    <>
      <main className="scroll-thin min-w-0 flex-1 overflow-y-auto p-5">
        <div className="space-y-5">
          <StatCards />
          <ProjectTable selectedId={selectedId} onSelect={setSelectedId} />
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <ProcessTimeline />
            <StatusDonut />
          </div>
        </div>
      </main>

      <div className="hidden lg:block">
        <DetailPanel project={selected} onClose={() => setSelectedId(null)} />
      </div>
    </>
  );
}
