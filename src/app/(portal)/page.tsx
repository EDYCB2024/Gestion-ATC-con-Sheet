import React from "react";
import { getCases } from "@/lib/google-sheets";

import Link from "next/link";
import { 
  BarChart3, 
  AlertTriangle, 
  Users,
  Clock,
  Activity
} from "lucide-react";

export default async function MonitoringPage() {
  const allCases = await getCases();
  const validCases = allCases;
  
  // LOGIC: Solo casos que tengan fecha de vencimiento NUMÉRICA Y no estén cerrados
  const expiryCases = validCases.filter(c => {
    // Verificamos si es un número (formato de fecha de Excel/Sheets)
    const hasExpiry = c.vencimientoCaso !== "" && !isNaN(Number(c.vencimientoCaso)) && typeof c.vencimientoCaso !== 'boolean';
    const s = (c.estatusCaso || "").toLowerCase();
    const isPending = !s.includes("cerrado") && !s.includes("resuelto") && !s.includes("resolved") && !s.includes("ok");
    return hasExpiry && isPending;
  });

  const criticalExpiry = expiryCases.filter(c => c.categoriaDeFalla === "Critical").length;
  
  const stats = [
    { 
      label: "Casos con Vencimiento", 
      value: expiryCases.length, 
      icon: Clock, 
      color: "bg-primary text-on-primary shadow-xl shadow-primary/20" 
    },
    { 
      label: "Críticos con Fecha", 
      value: criticalExpiry, 
      icon: AlertTriangle, 
      color: "bg-error text-on-error shadow-lg shadow-error/20" 
    }
  ];

  // Logic: Group by Agent (Only Pending)
  const agentGroups: Record<string, number> = {};
  expiryCases.forEach(c => {
    const agent = c.analistaOperacionesTecnicas || "Sin Asignar";
    agentGroups[agent] = (agentGroups[agent] || 0) + 1;
  });

  const sortedAgents = Object.entries(agentGroups)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="p-10 space-y-12 max-w-7xl mx-auto w-full">
      {/* 1. Header Section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-2 h-2 bg-primary rounded-full absolute -top-1 -right-1 animate-ping"></div>
              <div className="w-1 h-8 bg-primary rounded-full"></div>
            </div>
            <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">
              Monitoreo de Vencimientos
            </h1>
          </div>

        </div>
        <p className="text-on-surface-variant opacity-50 font-medium pl-6">
          Visualización exclusiva de casos técnicos con fecha límite de entrega.
        </p>
      </section>

      {/* 2. KPI Cards - Optimized for 2 items */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-container-low rounded-2xl p-7 flex flex-col gap-5 hover:bg-surface-container-low/80 transition-colors">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-sm`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-headline font-black uppercase tracking-[0.25em] opacity-40 mb-1">
                {stat.label}
              </p>
              <p className="font-headline font-black text-4xl text-on-surface">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* 3. Detailed Stats Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Progress Bars */}
        <div className="lg:col-span-2 bg-surface-container-low rounded-[32px] p-10 space-y-10 border border-surface-variant/5">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="font-headline font-black text-sm uppercase tracking-[0.4em] text-on-surface-variant opacity-60">
              Casos Abiertos por Agente
            </h2>
          </div>

          <div className="space-y-8">
            {sortedAgents.slice(0, 8).map(([agent, count]) => {
              const maxCases = sortedAgents[0][1] || 1;
              const percentage = (count / maxCases) * 100;
              
              return (
                <div key={agent} className="space-y-3 group">
                  <div className="flex items-center justify-between">
                    <span className="font-headline font-bold text-sm text-on-surface uppercase tracking-wider group-hover:text-primary transition-colors">
                      {agent}
                    </span>
                    <span className="font-headline font-black text-lg text-primary">
                      {count}
                    </span>
                  </div>
                  <div className="h-3 bg-surface-container-highest rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Mini Cards */}
        <div className="space-y-8">
          <div className="bg-surface-container-low rounded-[32px] p-10 space-y-8 h-full border border-surface-variant/5">
            <div className="flex items-center gap-3 border-b border-surface-variant/10 pb-6">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h2 className="font-headline font-black text-sm uppercase tracking-[0.4em] text-on-surface-variant opacity-60">
                Resumen de Carga
              </h2>
            </div>

            <div className="space-y-6">
              {/* Card 1: Critical */}
              <div className="bg-surface-container-highest/30 p-8 rounded-3xl space-y-4 border border-surface-variant/5">
                <p className="text-[10px] font-headline font-black uppercase tracking-widest text-on-surface-variant opacity-40">
                  Criticidad con Fecha
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-headline font-black text-error">
                    {criticalExpiry}
                  </span>
                  <span className="text-xs font-bold text-on-surface-variant opacity-40 uppercase tracking-tighter">
                    Críticos
                  </span>
                </div>
              </div>

              {/* Card 2: Total Pendientes */}
              <div className="bg-surface-container-highest/30 p-8 rounded-3xl space-y-4 border border-surface-variant/5">
                <p className="text-[10px] font-headline font-black uppercase tracking-widest text-on-surface-variant opacity-40">
                  Total con Vencimiento
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-headline font-black text-primary">
                    {expiryCases.length}
                  </span>
                  <span className="text-xs font-bold text-on-surface-variant opacity-40 uppercase tracking-tighter">
                    Pendientes
                  </span>
                </div>
              </div>

              {/* Info Label */}
              <div className="mt-auto pt-6">
                <div className="bg-primary/5 rounded-2xl p-4 text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary opacity-60">
                    Sincronizado con Google Sheets • Tiempo Real
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
