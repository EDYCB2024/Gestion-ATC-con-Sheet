import React from "react";
import { getCases } from "@/lib/google-sheets";

import { 
  BarChart3, 
  Users, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  LayoutDashboard,
  Calendar,
  Zap,
  Activity
} from "lucide-react";

export default async function DashboardPage() {
  const allCases = await getCases();
  const validCases = allCases;
  
  // Basic Counts
  const totalCases = validCases.length;
  const closedStatus = ["cerrado", "resuelto", "resolved", "ok", "finalizado"];
  const closedCases = validCases.filter(c => 
    closedStatus.some(s => (c.estatusCaso || "").toLowerCase().includes(s))
  ).length;
  const pendingCases = totalCases - closedCases;
  const resolutionRate = totalCases > 0 ? Math.round((closedCases / totalCases) * 100) : 0;

  // 1. Time Calculation Logic (Minutes)
  const calculateMinutes = (timeStr: any) => {
    if (!timeStr) return null;
    try {
      const date = new Date(timeStr);
      if (isNaN(date.getTime())) return null;
      return date.getUTCHours() * 60 + date.getUTCMinutes();
    } catch { return null; }
  };

  const responseTimes: number[] = [];
  const agentPerformance: Record<string, { totalTime: number, count: number, closed: number }> = {};
  const groupPerformance: Record<string, number> = {};

  validCases.forEach(c => {
    const reportMin = calculateMinutes(c.horaDeReporte);
    const attentionMin = calculateMinutes(c.horaDeAtencion);
    const agent = c.analistaOperacionesTecnicas || "Sin Asignar";
    const group = c.reportadoEn || "Sin Grupo";
    
    // Agent Logic
    if (!agentPerformance[agent]) {
      agentPerformance[agent] = { totalTime: 0, count: 0, closed: 0 };
    }
    
    const isClosed = closedStatus.some(s => (c.estatusCaso || "").toLowerCase().includes(s));
    if (isClosed) agentPerformance[agent].closed++;
    agentPerformance[agent].count++;

    // Group Logic
    groupPerformance[group] = (groupPerformance[group] || 0) + 1;

    if (reportMin !== null && attentionMin !== null) {
      let diff = attentionMin - reportMin;
      if (diff < 0) diff += 1440; 
      
      if (diff > 0 && diff < 1440) {
        responseTimes.push(diff);
        agentPerformance[agent].totalTime += diff;
      }
    }
  });

  const avgResponseGeneral = responseTimes.length > 0 
    ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) 
    : 0;

  // 2. Stats by Month (from c.fecha)
  const monthStats: Record<string, number> = {};
  validCases.forEach(c => {
    if (c.fecha) {
      const parts = String(c.fecha).split("-");
      let label = "Unknown";
      if (parts.length >= 2) {
        label = `${parts[1]}-${parts[0]}`; 
      } else {
        const d = new Date(c.fecha);
        if (!isNaN(d.getTime())) {
          label = `${d.getUTCMonth() + 1}-${d.getUTCFullYear()}`;
        }
      }
      monthStats[label] = (monthStats[label] || 0) + 1;
    }
  });

  const sortedMonths = Object.entries(monthStats)
    .sort((a, b) => {
      const [m1, y1] = a[0].split("-").map(Number);
      const [m2, y2] = b[0].split("-").map(Number);
      return (y1 * 12 + m1) - (y2 * 12 + m2);
    })
    .slice(-6); 

  const kpis = [
    { label: "Casos Totales", value: totalCases, icon: BarChart3, color: "text-primary", bg: "bg-primary/10" },
    { label: "Respuesta Prom.", value: `${avgResponseGeneral} min`, icon: Clock, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "Tasa Resolución", value: `${resolutionRate}%`, icon: Zap, color: "text-tertiary", bg: "bg-tertiary/10" },
    { label: "Pendientes", value: pendingCases, icon: Calendar, color: "text-error", bg: "bg-error/10" },
  ];

  return (
    <div className="p-10 space-y-12 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-primary rounded-[20px] flex items-center justify-center shadow-2xl shadow-primary/30 rotate-3">
            <LayoutDashboard className="text-white w-7 h-7 -rotate-3" />
          </div>
          <div>
            <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface uppercase">Dashboard</h1>
            <p className="text-on-surface-variant/50 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Monitoreo de Casos y Rendimiento</p>
          </div>
        </div>

      </section>

      {/* KPI Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white/80 backdrop-blur-xl rounded-[40px] p-8 flex flex-col gap-6 hover:bg-white transition-all border border-outline-variant/30 shadow-sm relative overflow-hidden group hover:shadow-xl hover:-translate-y-1">
            <div className={`w-16 h-16 ${kpi.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
              <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40 mb-2">{kpi.label}</p>
              <p className="font-headline font-black text-5xl text-on-surface tracking-tighter">{kpi.value}</p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Trends Section */}
        <section className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-[48px] p-12 border border-outline-variant/30 space-y-10 shadow-sm">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-headline font-black text-[11px] uppercase tracking-[0.5em] text-on-surface-variant/40 flex items-center gap-3 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Tendencia Operativa
              </h2>
              <p className="text-2xl font-black text-on-surface tracking-tight">Evolución de Casos (6 Meses)</p>
            </div>
            <div className="flex gap-2">
               <div className="px-4 py-1.5 bg-primary/5 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">Sincronizado</div>
            </div>
          </div>
          
          <div className="grid grid-cols-6 gap-6 items-end h-64 pt-10">
            {sortedMonths.map(([month, count]) => {
              const max = Math.max(...Object.values(monthStats));
              const height = (count / max) * 100;
              return (
                <div key={month} className="group relative flex flex-col items-center gap-4 h-full">
                  <div className="absolute -top-8 bg-primary text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all">
                    {count}
                  </div>
                  <div className="w-full bg-surface-container-low rounded-2xl flex-1 relative overflow-hidden">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-xl group-hover:bg-primary-container transition-all duration-700 ease-out" 
                      style={{ height: `${height}%` }}
                    >
                       <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <span className="font-black text-[10px] text-on-surface-variant/40 uppercase tracking-widest">{month}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Efficiency Sidebar */}
        <section className="bg-primary rounded-[48px] p-12 space-y-10 shadow-2xl shadow-primary/30 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-headline font-black text-[11px] uppercase tracking-[0.5em] text-white/40 flex items-center gap-3 mb-2">
              <Users className="w-4 h-4 text-white/60" /> Analistas
            </h2>
            <p className="text-2xl font-black text-white tracking-tight mb-8">Rendimiento</p>
            
            <div className="space-y-4">
              {Object.entries(agentPerformance)
                .sort((a, b) => b[1].closed - a[1].closed)
                .slice(0, 5)
                .map(([agent, stats]) => {
                  const efficiency = stats.count > 0 ? Math.round((stats.closed / stats.count) * 100) : 0;
                  return (
                    <div key={agent} className="p-5 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 group hover:bg-white hover:text-primary transition-all duration-500">
                      <div className="flex items-center justify-between mb-3">
                         <span className="font-black text-[12px] truncate pr-4 uppercase tracking-tight">{agent}</span>
                         <span className="text-[10px] font-black px-2 py-0.5 bg-white/20 rounded-full group-hover:bg-primary/10 group-hover:text-primary">{efficiency}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-3">
                         <div className="h-full bg-white group-hover:bg-primary transition-all duration-700" style={{ width: `${efficiency}%` }} />
                      </div>
                      <div className="flex justify-between items-center opacity-60 group-hover:opacity-100">
                         <span className="text-[9px] font-black uppercase tracking-widest">{stats.closed} Cerrados</span>
                         <span className="text-[9px] font-black uppercase tracking-widest">{stats.totalTime > 0 ? `${Math.round(stats.totalTime / stats.count)}m` : '--'} Avg</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          {/* Abstract Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24 blur-2xl" />
        </section>
      </div>

      {/* Group Statistics - Full Width Cards */}
      <section className="bg-white/80 backdrop-blur-xl rounded-[48px] p-12 border border-outline-variant/30 space-y-10 shadow-sm">
         <h2 className="font-headline font-black text-[11px] uppercase tracking-[0.5em] text-on-surface-variant/40 flex items-center gap-3">
            <Activity className="w-4 h-4 text-primary" /> Casos por Grupo
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(groupPerformance)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 8)
              .map(([group, count]) => (
                <div key={group} className="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/10 group hover:border-primary/30 transition-all">
                   <p className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-2 truncate">{group}</p>
                   <div className="flex items-end justify-between">
                      <span className="text-3xl font-black text-on-surface">{count}</span>
                      <div className="w-12 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                         <TrendingUp className="w-3.5 h-3.5 text-primary" />
                      </div>
                   </div>
                </div>
              ))}
         </div>
      </section>
    </div>
  );
}
