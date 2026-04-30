import React from "react";
import { getCases } from "@/lib/google-sheets";
import { RefreshButton } from "@/components/ui/RefreshButton";
import { 
  Wrench, 
  Search, 
  Settings2, 
  Smartphone,
  CheckCircle2,
  Clock,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export default async function POSRepairsPage() {
  const allCases = await getCases();
  
  // Filter cases that look like Repairs (Hardware fail or similar)
  const repairKeywords = ["hardware", "reparacion", "equipo", "cambio", "tecnico"];
  const repairCases = allCases.filter(c => {
    const falla = (c.fallaReportadaCliente || "").toLowerCase();
    const cat = (c.categoriaDeFalla || "").toLowerCase();
    return repairKeywords.some(key => falla.includes(key) || cat.includes(key));
  });

  return (
    <div className="p-10 space-y-12 max-w-7xl mx-auto w-full">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Settings2 className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">
              Gestión de Reparaciones POS
            </h1>
          </div>
          <p className="text-on-surface-variant opacity-50 font-medium pl-16">
            Control de equipos en taller, cambios de hardware y diagnósticos técnicos.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex bg-surface-container-low px-4 py-2 rounded-xl border border-surface-variant/10 items-center gap-2">
             <Search className="w-4 h-4 opacity-40" />
             <input type="text" placeholder="Buscar Serial..." className="bg-transparent border-none text-xs font-bold focus:ring-0 outline-none w-40" />
          </div>
          <RefreshButton />
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-low p-6 rounded-3xl border border-surface-variant/5">
           <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Total Equipos</p>
           <p className="text-3xl font-headline font-black text-on-surface">{repairCases.length}</p>
        </div>
        <div className="bg-surface-container-low p-6 rounded-3xl border border-surface-variant/5">
           <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">En Diagnóstico</p>
           <p className="text-3xl font-headline font-black text-primary">
             {repairCases.filter(c => !c.estatusCaso?.toLowerCase().includes("cerrado")).length}
           </p>
        </div>
        <div className="bg-surface-container-low p-6 rounded-3xl border border-surface-variant/5">
           <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Listos / Entregados</p>
           <p className="text-3xl font-headline font-black text-success">
             {repairCases.filter(c => c.estatusCaso?.toLowerCase().includes("cerrado")).length}
           </p>
        </div>
        <div className="bg-surface-container-low p-6 rounded-3xl border border-surface-variant/5">
           <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Urgencia Crítica</p>
           <p className="text-3xl font-headline font-black text-error">
             {repairCases.filter(c => c.categoriaDeFalla === "Critical").length}
           </p>
        </div>
      </div>

      {/* Repair Management Table */}
      <section className="bg-surface-container-low rounded-[40px] border border-surface-variant/10 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-highest/20 border-b border-surface-variant/10">
              <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] opacity-40 text-on-surface">Equipo / Serial</th>
              <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] opacity-40 text-on-surface">Comercio</th>
              <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] opacity-40 text-on-surface">Tipo de Falla</th>
              <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] opacity-40 text-on-surface">Estatus Reparación</th>
              <th className="px-8 py-6 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-variant/5">
            {repairCases.map((c, i) => {
              const isClosed = c.estatusCaso?.toLowerCase().includes("cerrado") || c.estatusCaso?.toLowerCase().includes("resolved");
              return (
                <tr key={`${c.caso}-${i}`} className="hover:bg-surface-container-lowest/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-headline font-black text-sm text-on-surface">#{c.caso}</p>
                        <p className="text-[10px] font-bold text-on-surface-variant opacity-40">{c.serial || 'Sin Serial'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-headline font-black text-[11px] uppercase text-on-surface-variant">{c.nombreComercio}</p>
                    <p className="text-[9px] font-bold opacity-40">{c.ciudad}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="max-w-[200px]">
                      <p className="text-[10px] font-bold text-on-surface-variant line-clamp-1">{c.fallaReportadaCliente}</p>
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary opacity-60">{c.categoriaDeFalla}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       {isClosed ? (
                         <span className="bg-success/10 text-success px-4 py-1.5 rounded-full font-headline font-black text-[9px] uppercase tracking-widest flex items-center gap-2">
                           <CheckCircle2 className="w-3 h-3" /> Reparado
                         </span>
                       ) : (
                         <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full font-headline font-black text-[9px] uppercase tracking-widest flex items-center gap-2">
                           <Clock className="w-3 h-3" /> En Taller
                         </span>
                       )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link 
                      href={`/cases/${c.caso}`}
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-surface-container-highest group-hover:bg-primary group-hover:text-on-primary transition-all shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
