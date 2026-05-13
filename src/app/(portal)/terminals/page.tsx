'use client'

import { ATCCase } from '@/lib/types';
import { fetchCasesAction } from '@/app/actions/case-actions';


import {
  Search,
  History,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Loader2,
  Calendar,
  ExternalLink,
  MessageSquare,
  Hash
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useState, useEffect } from 'react';

export default function TraceabilityPage() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cases, setCases] = useState<ATCCase[]>([]);
  const [filteredCases, setFilteredCases] = useState<ATCCase[]>([]);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const allCases = await fetchCasesAction();
      setCases(allCases);

      // If there's a search query, filter immediately
      if (searchQuery) {
        filterData(allCases, searchQuery);
      }
    } catch (err) {
      console.error('Error fetching cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterData = (data: ATCCase[], query: string) => {
    const q = query.toLowerCase();
    const filtered = data.filter(c => 
      String(c.serial || '').toLowerCase().includes(q) ||
      String(c.caso || '').toLowerCase().includes(q) ||
      String(c.nombreComercio || '').toLowerCase().includes(q)
    );
    setFilteredCases(filtered);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    if (cases.length > 0) {
      filterData(cases, searchQuery);
    }
  }, [searchQuery, cases]);

  const stats = [
    { label: "Casos Registrados", value: cases.length, icon: History, color: "text-primary", bg: "bg-primary/10" },
    { label: "Búsqueda Activa", value: filteredCases.length, icon: Search, color: "text-secondary", bg: "bg-secondary/10" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <header className="px-10 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <History className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-headline font-black text-on-surface tracking-tight uppercase">Trazabilidad de Casos</h1>
            </div>
            <p className="text-body-md text-on-surface-variant/70 font-medium">Historial completo de incidencias por serial o comercio.</p>
          </div>
          <button
            onClick={fetchCases}
            disabled={loading}
            className="flex items-center gap-3 bg-white border border-outline-variant/30 text-on-surface px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all hover:bg-surface-container-low active:scale-95 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin text-primary" /> : <RefreshCw className="w-4 h-4 text-primary" />}
            Actualizar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 max-w-[800px]">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/80 backdrop-blur-md p-6 rounded-[32px] border border-outline-variant/30 shadow-sm transition-all hover:shadow-md flex items-center gap-6">
              <div className={cn("p-4 rounded-2xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div>
                <p className="text-[10px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <h3 className="text-3xl font-headline font-black text-on-surface">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>
      </header>

      <main className="px-10 pb-10 space-y-8">
        {/* Search Interface */}
        <div className="bg-white/80 backdrop-blur-md rounded-[40px] border border-outline-variant/30 p-8 shadow-sm">
          <div className="max-w-2xl mx-auto">
             <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Ingrese Serial, Nro de Caso o Comercio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-8 py-5 bg-surface-container-low border border-outline-variant/20 rounded-[24px] text-lg font-bold text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all shadow-inner"
                />
             </div>
             {searchQuery && (
               <p className="text-center mt-4 text-[10px] font-black uppercase text-on-surface-variant/40 tracking-[0.2em]">
                 Mostrando {filteredCases.length} resultados para "{searchQuery}"
               </p>
             )}
          </div>
        </div>

        {/* Results / Timeline */}
        <div className="space-y-6">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-xs font-black text-on-surface-variant/50 uppercase tracking-widest">Consultando Google Sheets...</p>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="py-20 text-center bg-white/50 rounded-[40px] border border-outline-variant/30 border-dashed">
              <History className="w-16 h-16 text-on-surface-variant/10 mx-auto mb-6" />
              <p className="text-xs font-black text-on-surface-variant/30 uppercase tracking-widest">Ingrese un serial para ver su trazabilidad</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredCases.map((c, idx) => (
                <div 
                  key={`${c.caso}-${idx}`}
                  className="bg-white/80 backdrop-blur-md p-8 rounded-[40px] border border-outline-variant/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                    <div className="space-y-6 flex-1">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                           <Hash className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-xl font-headline font-black text-on-surface">Caso #{c.caso}</h4>
                          <p className="text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest">{c.fecha}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <TraceItem icon={Calendar} label="Fecha Reporte" value={c.fecha} />
                        <TraceItem icon={Clock} label="Tiempo Atención" value={c.tiempo || 'En curso'} />
                        <TraceItem icon={CheckCircle2} label="Estatus" value={c.estatusCaso} highlighted />
                        <TraceItem icon={MessageSquare} label="Falla Reportada" value={c.fallaReportadaCliente} full />
                      </div>
                    </div>

                    <div className="md:w-72 space-y-4 pt-4 border-t md:border-t-0 md:border-l border-outline-variant/20 md:pl-8">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest">Serial del Equipo</p>
                          <p className="text-sm font-black text-primary font-mono">{c.serial}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest">Comercio / RIF</p>
                          <p className="text-xs font-bold text-on-surface leading-tight">{c.nombreComercio}</p>
                          <p className="text-[10px] font-medium text-on-surface-variant/60">{c.rif}</p>
                       </div>
                       <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-surface-container-low rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all group/btn">
                          Ver Detalles <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover/btn:opacity-100" />
                       </button>
                    </div>
                  </div>
                  
                  {/* Decorative element */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function TraceItem({ icon: Icon, label, value, highlighted, full }: any) {
  return (
    <div className={cn(
      "space-y-2",
      full && "sm:col-span-2 lg:col-span-3"
    )}>
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-on-surface-variant/40" />
        <span className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-widest">{label}</span>
      </div>
      <p className={cn(
        "text-xs font-bold leading-relaxed",
        highlighted ? "text-primary uppercase tracking-tighter" : "text-on-surface-variant"
      )}>
        {value || 'No especificado'}
      </p>
    </div>
  )
}
