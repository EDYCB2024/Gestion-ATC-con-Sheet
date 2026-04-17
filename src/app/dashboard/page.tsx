import React from "react";
import { getCases } from "@/lib/google-sheets";
import { RefreshButton } from "@/components/ui/RefreshButton";
import { 
  BarChart3, 
  Users, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  LayoutDashboard,
  Calendar,
  Zap
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

  validCases.forEach(c => {
    const reportMin = calculateMinutes(c.horaDeReporte);
    const attentionMin = calculateMinutes(c.horaDeAtencion);
    const agent = c.analistaOperacionesTecnicas || "Sin Asignar";
    
    if (!agentPerformance[agent]) {
      agentPerformance[agent] = { totalTime: 0, count: 0, closed: 0 };
    }
    
    const isClosed = closedStatus.some(s => (c.estatusCaso || "").toLowerCase().includes(s));
    if (isClosed) agentPerformance[agent].closed++;
    agentPerformance[agent].count++;

    if (reportMin !== null && attentionMin !== null) {
      // Handle day rollover if necessary (basic diff)
      let diff = attentionMin - reportMin;
      if (diff < 0) diff += 1440; // Add 24 hours in mins
      
      // Filter out outliers (e.g., > 12 hours)
      if (diff > 0 && diff < 720) {
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
      // Assume YYYY-MM-DD or MM/DD/YYYY - let's try to get Month-Year
      let label = "Unknown";
      if (parts.length >= 2) {
        label = `${parts[1]}-${parts[0]}`; // MM-YYYY
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
    .slice(-6); // Last 6 months

  const kpis = [
    { label: "Casos Totales", value: totalCases, icon: BarChart3, color: "text-primary", bg: "bg-primary/10" },
    { label: "Respuesta Prom.", value: `${avgResponseGeneral} min`, icon: Clock, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "Tasa Resolución", value: `${resolutionRate}%`, icon: Zap, color: "text-tertiary", bg: "bg-tertiary/10" },
    { label: "Pendientes", value: pendingCases, icon: Calendar, color: "text-error", bg: "bg-error/10" },
  ];

  return (
    <div className="p-10 space-y-12 max-w-7xl mx-auto w-full">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
            <LayoutDashboard className="text-primary w-6 h-6" />
          </div>
          <div>
            <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">Analytics Hub</h1>
            <p className="text-on-surface-variant opacity-50 font-medium">Panel de indicadores operativos y eficiencia por analista.</p>
          </div>
        </div>
        <RefreshButton />
      </section>

      {/* KPI Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-surface-container-low rounded-[2rem] p-8 flex flex-col gap-6 hover:bg-surface-container-low/80 transition-all border border-surface-variant/10 shadow-sm relative overflow-hidden group">
            <div className={`w-14 h-14 ${kpi.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
              <kpi.icon className={`w-7 h-7 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-[11px] font-headline font-black uppercase tracking-[0.2em] opacity-40 mb-1">{kpi.label}</p>
              <p className="font-headline font-black text-4xl text-on-surface tracking-tighter">{kpi.value}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trend */}
        <section className="bg-surface-container-low rounded-[2.5rem] p-10 border border-surface-variant/10 space-y-8">
          <h2 className="font-headline font-black text-xs uppercase tracking-[0.4em] text-on-surface-variant opacity-60 flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-primary" /> Tendencia por Mes
          </h2>
          <div className="space-y-6">
            {sortedMonths.map(([month, count]) => {
              const max = Math.max(...Object.values(monthStats));
              const height = (count / max) * 100;
              return (
                <div key={month} className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <span className="font-headline text-[13px] font-black text-on-surface">{month}</span>
                    <span className="font-headline text-[13px] font-black text-primary">{count} casos</span>
                  </div>
                  <div className="h-3 w-full bg-surface-variant/20 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${height}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Top Agents by Efficiency */}
        <section className="bg-surface-container-low rounded-[2.5rem] p-10 border border-surface-variant/10 space-y-8">
          <h2 className="font-headline font-black text-xs uppercase tracking-[0.4em] text-on-surface-variant opacity-60 flex items-center gap-3">
            <Users className="w-4 h-4 text-primary" /> Eficiencia por Analista
          </h2>
          <div className="space-y-6">
            {Object.entries(agentPerformance)
              .sort((a, b) => b[1].closed - a[1].closed)
              .slice(0, 6)
              .map(([agent, stats]) => {
                const efficiency = stats.count > 0 ? Math.round((stats.closed / stats.count) * 100) : 0;
                return (
                  <div key={agent} className="p-4 bg-surface-container-highest/20 rounded-2xl border border-surface-variant/5">
                    <div className="flex items-center justify-between mb-2">
                       <span className="font-headline text-xs font-black text-on-surface truncate pr-4">{agent}</span>
                       <span className="text-xs font-black text-secondary">{efficiency}% Efic.</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                         <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                         <span className="text-[10px] font-bold opacity-60">{stats.closed} Cerrados</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <Clock className="w-3.5 h-3.5 text-primary" />
                         <span className="text-[10px] font-bold opacity-60">
                           {stats.totalTime > 0 ? `${Math.round(stats.totalTime / stats.count)} min` : '--'}
                         </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      </div>
    </div>
  );
}
