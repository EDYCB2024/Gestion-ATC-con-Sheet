import React from "react";
import { getCases } from "@/lib/google-sheets";
import Link from "next/link";
import { 
  Building2,
  ChevronRight, 
  Plus, 
  Activity,
  Layers,
  ArrowRight
} from "lucide-react";
import { RefreshButton } from "@/components/ui/RefreshButton";

const groups = [
  "Operaciones y ST",
  "Megapos",
  "Token Pagos",
  "Pos Comercial",
  "Instapago",
  "Tu punto Plus",
  "Servinet",
  "Punto Pos",
  "Puntpago"
];

export default async function CooperadoresPage() {
  const allCases = await getCases();

  return (
    <div className="p-10 max-w-5xl mx-auto w-full space-y-12">
      {/* Minimal Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-surface-variant/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Building2 className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Gestión de Aliados</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface">
              Cooperadores
            </h1>
            <span className="mt-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {groups.length} Registrados
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            className="flex items-center gap-2 bg-on-surface text-surface px-6 py-3 rounded-xl font-headline font-black text-[10px] uppercase tracking-widest transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-on-surface/10"
          >
            <Plus className="w-4 h-4" />
            Añadir Cooperador
          </button>
          <RefreshButton />
        </div>
      </header>

      {/* Vertical Minimal List */}
      <div className="space-y-4">
        {groups.map((group) => {
          const groupCases = allCases.filter(c => 
            String(c.asignarGrupo || "").toLowerCase() === group.toLowerCase()
          );

          return (
            <Link
              key={group}
              href={`/groups/${group.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex items-center justify-between p-6 bg-surface-container-lowest rounded-2xl border border-surface-variant/5 hover:border-primary/20 hover:bg-primary/[0.01] transition-all group"
            >
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant opacity-40 group-hover:text-primary group-hover:opacity-100 transition-all">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-headline font-black text-lg text-on-surface group-hover:text-primary transition-colors">
                    {group}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-30">Aliado Operativo</span>
                    <div className="w-1 h-1 rounded-full bg-surface-variant/40" />
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-tertiary opacity-40" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-tertiary opacity-60">Activo</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-30 mb-0.5">Casos Totales</p>
                  <p className="font-headline font-black text-xl text-on-surface">{groupCases.length}</p>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low text-on-surface-variant opacity-20 group-hover:opacity-100 group-hover:bg-primary group-hover:text-white transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Simple Footer Info */}
      <footer className="pt-8 border-t border-surface-variant/10 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-20">
          Control ATC • Sistema de Gestión de Cooperadores
        </p>
      </footer>
    </div>
  );
}
