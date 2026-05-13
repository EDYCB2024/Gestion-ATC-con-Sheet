import React from "react";
import { getCases } from "@/lib/google-sheets";
import { 
  Users2, 
  MapPin, 
  Award, 
  Phone, 
  Mail,
  ChevronRight,
  UserPlus
} from "lucide-react";
import Link from "next/link";
import { RefreshButton } from "@/components/ui/RefreshButton";

export default async function AgentsPage() {
  const allCases = await getCases();

  // Extract unique agents dynamically
  const uniqueAgentNames = Array.from(new Set(
    allCases
      .map(c => c.analistaOperacionesTecnicas)
      .filter(name => name && name.trim() !== "" && name !== "N/A" && name !== "(FALTA DATO)")
  )) as string[];

  const agents = uniqueAgentNames.map(name => {
    const agentCases = allCases.filter(c => 
      c.analistaOperacionesTecnicas === name
    );
    
    return {
      name,
      initials: name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 3),
      casesCount: agentCases.length,
      resolvedCount: agentCases.filter(c => {
        const s = (c.estatusCaso || "").toLowerCase();
        return s.includes("cerrado") || s.includes("resolved") || s.includes("ok") || s.includes("resuelto");
      }).length,
      lastCase: agentCases[0]?.nombreComercio || "No asigs. hoy"
    };
  }).sort((a, b) => b.casesCount - a.casesCount);

  return (
    <div className="p-10 space-y-12 max-w-7xl mx-auto w-full">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Users2 className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">
              Equipo Técnico ATC
            </h1>
            <div className="h-10 w-px bg-surface-variant/20 mx-2 hidden md:block"></div>
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full font-headline font-black text-xs uppercase tracking-widest flex items-center gap-2">
              {agents.length} Miembros
            </span>
          </div>
          <p className="text-on-surface-variant opacity-50 font-medium pl-14">
            Analistas de Operaciones Técnicas responsables de la red.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="flex items-center justify-center gap-3 bg-primary text-on-primary px-8 py-4 rounded-2xl font-headline font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-primary/30"
          >
            <UserPlus className="w-5 h-5" />
            Añadir Agente
          </button>
          <div className="h-10 w-px bg-surface-variant/20 mx-2 hidden md:block"></div>
          <RefreshButton />
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {agents.map((agent) => (
          <div 
            key={agent.name} 
            className="bg-surface-container-lowest rounded-[32px] p-8 border border-surface-variant/10 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-500 group relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>

            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex items-start justify-between">
                <div className="w-16 h-16 bg-primary text-on-primary rounded-2xl flex items-center justify-center font-headline font-black text-2xl shadow-lg shadow-primary/20">
                  {agent.initials}
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40 mb-1">Status</span>
                   <div className="flex items-center gap-2 px-3 py-1 bg-tertiary/10 text-tertiary rounded-full">
                     <div className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></div>
                     <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                   </div>
                </div>
              </div>

              <div>
                <h3 className="font-headline font-black text-2xl text-on-surface mb-1">
                  {agent.name}
                </h3>
                <p className="text-xs font-bold text-primary uppercase tracking-widest opacity-70">
                  Analista de Operaciones
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-6 border-y border-surface-variant/10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 mb-1">Casos Hoy</p>
                  <p className="font-headline font-black text-2xl text-on-surface">{agent.casesCount}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 mb-1">Efectividad</p>
                  <p className="font-headline font-black text-2xl text-tertiary">
                    {agent.casesCount > 0 ? Math.round((agent.resolvedCount / agent.casesCount) * 100) : 0}%
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-on-surface-variant/60">
                  <Award className="w-4 h-4" />
                  <span className="text-xs font-medium">Último: {agent.lastCase}</span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant/60">
                  <Phone className="w-4 h-4" />
                  <span className="text-xs font-medium">+58 4XX-XXXXXXX</span>
                </div>
              </div>

              <button className="w-full mt-2 py-4 bg-surface-container-low rounded-2xl font-headline font-black text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group/btn">
                Ver Reporte Detallado
                <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
