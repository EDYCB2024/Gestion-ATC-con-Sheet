import React from "react";
import { getCases } from "@/lib/google-sheets";
import { RefreshButton } from "@/components/ui/RefreshButton";
import { 
  Wrench, 
  CheckCircle2, 
  Clock, 
  Activity,
  AlertTriangle,
  TrendingUp,
  BarChart2
} from "lucide-react";
import Link from "next/link";

export default async function TechnicalServicePage() {
  const allCases = await getCases();
  const validCases = allCases;
  
  const closedStatus = ["cerrado", "resuelto", "resolved", "ok", "finalizado"];

  // 1. Sector/Group Analytics
  const serviceStats: Record<string, { total: number, closed: number, critical: number, history: number[] }> = {};

  validCases.forEach(c => {
    const group = c.reportadoEn || "Sin Grupo";
    if (!serviceStats[group]) {
      serviceStats[group] = { total: 0, closed: 0, critical: 0, history: [] };
    }
    
    serviceStats[group].total++;
    const isClosed = closedStatus.some(s => (c.estatusCaso || "").toLowerCase().includes(s));
    if (isClosed) serviceStats[group].closed++;
    if (c.categoriaDeFalla === "Critical") serviceStats[group].critical++;
  });

  const sortedServices = Object.entries(serviceStats)
    .sort((a, b) => b[1].total - a[1].total);

  return (
    <div className="p-10 space-y-12 max-w-7xl mx-auto w-full">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">
              Servicio Técnico
            </h1>
          </div>
          <p className="text-on-surface-variant opacity-50 font-medium pl-16">
            Análisis de operaciones por canal de reporte y grupos técnicos.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Link 
            href="/technical-service/repairs"
            className="w-full md:w-auto flex items-center justify-center gap-3 bg-primary text-on-primary px-8 py-4 rounded-[1.5rem] font-headline font-black text-xs uppercase tracking-[0.15em] shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-[0.98]"
          >
            <Wrench className="w-4 h-4" />
            Gestionar Reparaciones POS
          </Link>
          <RefreshButton />
        </div>
      </header>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedServices.map(([name, stats]) => {
          const resolutionRate = stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0;
          
          return (
            <div 
              key={name}
              className="bg-surface-container-low rounded-[32px] p-8 border border-surface-variant/10 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-container-highest rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="font-headline font-black text-lg text-on-surface truncate max-w-[150px]">
                    {name}
                  </h3>
                </div>
                <span className="bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  {stats.total} Casos
                </span>
              </div>

              <div className="space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-highest/30 p-4 rounded-2xl">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Resolución</p>
                    <p className="font-headline font-black text-xl text-primary">{resolutionRate}%</p>
                  </div>
                  <div className="bg-surface-container-highest/30 p-4 rounded-2xl">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Críticos</p>
                    <p className="font-headline font-black text-xl text-error">{stats.critical}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Carga Operativa</span>
                    <span className="text-[10px] font-black text-on-surface">{stats.total - stats.closed} Pendientes</span>
                  </div>
                  <div className="h-2 w-full bg-surface-variant/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${resolutionRate}%` }}
                    />
                  </div>
                </div>

                {/* Quick Info */}
                <div className="pt-4 border-t border-surface-variant/10 flex items-center justify-between text-[10px] font-bold text-on-surface-variant opacity-60">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-success" />
                    <span>{stats.closed} Cerrados</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BarChart2 className="w-3 h-3 text-secondary" />
                    <span>Avg. 15min</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
