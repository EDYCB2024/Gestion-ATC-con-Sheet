"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { Plus, Ticket, Search, Filter, MoreHorizontal, Clock, ArrowRight, X } from "lucide-react";
import { CreateTicketModal } from "@/components/tickets/CreateTicketModal";
import { CalendarPopover } from "@/components/ui/CalendarPopover";
import { RefreshButton } from "@/components/ui/RefreshButton";
import { ATCCase } from "@/lib/types";

import { cn } from "@/lib/utils";

interface TicketsListProps {
  initialTickets: ATCCase[];
}

export function TicketsList({ initialTickets }: TicketsListProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate Next Ticket ID
  const nextTicketId = String(
    Math.max(
      ...initialTickets.map(t => {
        const num = parseInt(String(t.caso || "").replace(/\D/g, ''));
        return isNaN(num) ? 0 : num;
      }), 
      0
    ) + 1
  );

  // Filtering logic
  const filteredTickets = initialTickets.filter(ticket => {
    const nombre = String(ticket.nombreComercio || "").toLowerCase();
    const caso = String(ticket.caso || "").toLowerCase();
    const rif = String(ticket.rif || "").toLowerCase();
    const serial = String(ticket.serial || "").toLowerCase();
    const query = (searchQuery || "").toLowerCase();

    const matchesSearch = 
      nombre.includes(query) ||
      caso.includes(query) ||
      rif.includes(query) ||
      serial.includes(query);
    
    const matchesDate = !selectedDate || (() => {
      if (!ticket.fecha) return false;
      
      const sy = selectedDate.getFullYear();
      const sm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const sd = String(selectedDate.getDate()).padStart(2, '0');
      const selectedStr = `${sy}-${sm}-${sd}`;
      
      let ticketStr = String(ticket.fecha).split('T')[0].split(' ')[0];
      
      if (ticketStr.includes('/')) {
        const parts = ticketStr.split('/');
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            ticketStr = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
          } else {
            ticketStr = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          }
        }
      }
      
      return ticketStr === selectedStr;
    })();

    return matchesSearch && matchesDate;
  });

  return (
    <div className="p-10 space-y-12 max-w-[1600px] mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 bg-primary rounded-[20px] flex items-center justify-center shadow-2xl shadow-primary/30 rotate-3">
             <Ticket className="text-white w-7 h-7 -rotate-3" />
           </div>
           <div>
             <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface uppercase">Gestión de Tickets</h1>
             <p className="text-on-surface-variant/50 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Soporte Técnico & Resolución de Casos</p>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
          <RefreshButton />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-4 bg-primary text-white px-10 py-4 rounded-2xl font-headline font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all hover:scale-[1.05] active:scale-[0.95] hover:opacity-90"
          >
            <Plus className="w-5 h-5" />
            Crear Nuevo Ticket
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Total Activos", value: initialTickets.length, icon: Ticket, color: "text-primary", bg: "bg-primary/10" },
          { 
            label: "Pendientes", 
            value: initialTickets.filter(t => !["cerrado", "resuelto"].includes(String(t.estatusCaso || "").toLowerCase())).length, 
            icon: Clock, 
            color: "text-tertiary", 
            bg: "bg-tertiary/10" 
          },
          { 
            label: "Críticos", 
            value: initialTickets.filter(t => String(t.categoriaDeFalla || "").toLowerCase().includes("crit")).length, 
            icon: ArrowRight, 
            color: "text-error", 
            bg: "bg-error/10" 
          }
        ].map((stat, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-xl p-8 rounded-[40px] border border-outline-variant/30 shadow-sm flex items-center gap-6 group hover:bg-white transition-all">
            <div className={`w-16 h-16 ${stat.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
              <stat.icon className={`${stat.color} w-8 h-8`} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40 mb-2">{stat.label}</p>
              <p className="text-4xl font-headline font-black text-on-surface tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/30 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por comercio, ticket, rif o serial..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/80 backdrop-blur-xl border border-outline-variant/30 rounded-3xl pl-14 pr-6 py-5 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-[13px] font-bold text-on-surface placeholder:text-on-surface-variant/30 shadow-sm"
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className={cn(
              "flex items-center justify-center w-[72px] h-[72px] rounded-3xl transition-all border shadow-lg",
              selectedDate 
                ? 'bg-primary text-white border-primary shadow-primary/20' 
                : 'bg-white border-outline-variant/30 text-on-surface hover:bg-surface-container-low'
            )}
            title={selectedDate ? `Filtrando por ${selectedDate.toLocaleDateString()}` : 'Filtrar por día'}
          >
            <Filter className="w-6 h-6" />
          </button>
          {isCalendarOpen && (
            <div className="absolute right-0 top-full mt-4 z-50">
               <CalendarPopover 
                 onSelectDate={(date) => setSelectedDate(date)} 
                 onClose={() => setIsCalendarOpen(false)} 
               />
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Indicator */}
      {selectedDate && (() => {
        const today = new Date();
        const sy = selectedDate.getFullYear();
        const sm = selectedDate.getMonth();
        const sd = selectedDate.getDate();
        const ty = today.getFullYear();
        const tm = today.getMonth();
        const td = today.getDate();
        const isToday = sy === ty && sm === tm && sd === td;
        
        if (isToday) return null;

        return (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-2xl shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Filtro:</span>
              <span className="text-xs font-black text-primary">{selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <button 
                onClick={() => setSelectedDate(null)}
                className="ml-2 p-1 hover:bg-primary/20 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-primary" />
              </button>
            </div>
            <button 
              onClick={() => setSelectedDate(null)}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40 hover:text-primary transition-colors"
            >
              Limpiar Todo
            </button>
          </div>
        );
      })()}

      {/* Tickets Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[48px] border border-outline-variant/30 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-primary/5 border-b border-outline-variant/30">
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-primary/60">Ticket ID</th>
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-primary/60">Fecha & Hora</th>
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-primary/60">Canal</th>
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-primary/60">Analista</th>
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-primary/60">Estado Actual</th>
                <th className="px-10 py-6 text-[11px] font-black uppercase tracking-[0.3em] text-primary/60 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredTickets.map((ticket) => {
                const estatus = String(ticket.estatusCaso || "").toLowerCase();
                return (
                  <tr 
                    key={ticket.caso} 
                    className="group hover:bg-primary/[0.03] transition-all cursor-pointer"
                  >
                    <td className="px-10 py-7">
                      <div className="flex flex-col">
                        <Link 
                          href={`/cases/${ticket.caso || 'unknown'}`}
                          className="font-headline font-black text-primary hover:text-tertiary transition-colors text-base underline decoration-primary/10 underline-offset-8"
                        >
                          #{ticket.caso || "---"}
                        </Link>
                        <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest mt-1.5">{ticket.rif || "SIN RIF"}</span>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex flex-col">
                        <span className="text-xs text-on-surface font-black">
                          {ticket.fecha?.split('T')[0]?.split(' ')[0]}
                        </span>
                        <span className="text-[10px] text-on-surface-variant/40 font-bold mt-1 uppercase">{ticket.horaDeReporte}</span>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <span className="px-4 py-1.5 bg-surface-container-low rounded-xl text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest">
                        {ticket.reportadoEn || "WhatsApp"}
                      </span>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-[11px] font-black text-primary shadow-inner">
                          {ticket.analistaOperacionesTecnicas?.charAt(0) || "?"}
                        </div>
                        <span className="text-[13px] text-on-surface font-bold tracking-tight">{ticket.analistaOperacionesTecnicas}</span>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <span className={cn(
                        "px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm",
                        estatus.includes('abier') ? 'bg-primary text-white shadow-primary/20' : 
                        estatus.includes('proce') ? 'bg-tertiary text-white shadow-tertiary/20' : 
                        'bg-surface-container-highest text-on-surface-variant/60'
                      )}>
                        {ticket.estatusCaso}
                      </span>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <button className="p-3 hover:bg-primary/10 hover:text-primary rounded-2xl transition-all opacity-0 group-hover:opacity-100 active:scale-90">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredTickets.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-surface-container-low rounded-[32px] flex items-center justify-center mb-8 rotate-6">
              <Ticket className="w-10 h-10 text-on-surface-variant/20 -rotate-6" />
            </div>
            <p className="font-headline font-black text-2xl uppercase tracking-[0.2em] text-on-surface-variant/20">Sin resultados</p>
            <p className="text-on-surface-variant/30 font-bold mt-2">No se encontraron tickets con los filtros aplicados.</p>
          </div>
        )}
      </div>

      <CreateTicketModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultTicketId={nextTicketId}
      />
    </div>
  );
}
