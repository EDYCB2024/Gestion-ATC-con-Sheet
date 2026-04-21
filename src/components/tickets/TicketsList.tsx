"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { Plus, Ticket, Search, Filter, MoreHorizontal, Clock, ArrowRight, X, RefreshCw } from "lucide-react";
import { CreateTicketModal } from "@/components/tickets/CreateTicketModal";
import { CalendarPopover } from "@/components/ui/CalendarPopover";
import { RefreshButton } from "@/components/ui/RefreshButton";
import { ATCCase } from "@/lib/google-sheets";

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
    // Definitive defensive check
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
      
      // Target format: YYYY-MM-DD
      const selectedStr = `${sy}-${sm}-${sd}`;
      
      // Normalize ticket date string
      let ticketStr = String(ticket.fecha).split('T')[0].split(' ')[0];
      
      // If it's in DD/MM/YYYY format, convert to YYYY-MM-DD
      if (ticketStr.includes('/')) {
        const parts = ticketStr.split('/');
        if (parts.length === 3) {
          // Check if it's DD/MM/YYYY or YYYY/MM/DD
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
    <div className="p-10 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Ticket className="text-primary w-5 h-5" />
            </div>
            <h1 className="text-3xl font-headline font-black text-on-surface tracking-tight">Gestión de Tickets</h1>
          </div>
          <p className="text-on-surface-variant opacity-60 text-sm font-medium">Administre los reportes técnicos y solicitudes de soporte.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <RefreshButton />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-3 bg-primary text-on-primary px-8 py-4 rounded-2xl font-headline font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-primary/30"
          >
            <Plus className="w-5 h-5" />
            Crear Ticket
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: "Total Activos", value: initialTickets.length, icon: Ticket, color: "bg-primary" },
          { 
            label: "Pendientes", 
            value: initialTickets.filter(t => !["cerrado", "resuelto"].includes(String(t.estatusCaso || "").toLowerCase())).length, 
            icon: Clock, 
            color: "bg-tertiary" 
          },
          { 
            label: "Críticos", 
            value: initialTickets.filter(t => String(t.categoriaDeFalla || "").toLowerCase().includes("crit")).length, 
            icon: ArrowRight, 
            color: "bg-error" 
          }
        ].map((stat, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-variant/20 shadow-sm flex items-center gap-5">
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center shadow-lg shadow-black/5`}>
              <stat.icon className="text-white w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-headline font-black uppercase tracking-widest text-on-surface-variant opacity-50">{stat.label}</p>
              <p className="text-2xl font-headline font-black text-on-surface">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant opacity-40" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low border border-surface-variant/30 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-sm font-medium"
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className={`flex items-center justify-center w-[56px] h-[60px] rounded-2xl transition-all border
              ${selectedDate 
                ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20' 
                : 'bg-on-surface border-on-surface text-surface hover:opacity-90 shadow-lg shadow-on-surface/10'}
            `}
            title={selectedDate ? `Filtrando por ${selectedDate.toLocaleDateString()}` : 'Filtrar por día'}
          >
            <Filter className="w-5 h-5" />
          </button>
          {isCalendarOpen && (
            <CalendarPopover 
              onSelectDate={(date) => setSelectedDate(date)} 
              onClose={() => setIsCalendarOpen(false)} 
            />
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
          <div className="flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
              <span className="text-[10px] font-headline font-black uppercase tracking-widest text-primary">Día:</span>
              <span className="text-xs font-bold text-primary">{selectedDate.toLocaleDateString()}</span>
              <button 
                onClick={() => setSelectedDate(null)}
                className="ml-2 p-0.5 hover:bg-primary/20 rounded-full transition-colors"
              >
                <X className="w-3.5 h-3.5 text-primary" />
              </button>
            </div>
            <button 
              onClick={() => setSelectedDate(null)}
              className="text-[9px] font-headline font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40 hover:opacity-100 transition-opacity"
            >
              Limpiar Filtros
            </button>
          </div>
        );
      })()}

      {/* Tickets Table */}
      <div className="bg-surface-container-lowest rounded-3xl border border-surface-variant/10 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary/5 border-b border-surface-variant/20">
              <th className="px-8 py-5 text-[10px] font-headline font-black uppercase tracking-[0.2em] text-primary/60">#Ticket</th>
              <th className="px-8 py-5 text-[10px] font-headline font-black uppercase tracking-[0.2em] text-primary/60">Fecha Creación</th>
              <th className="px-8 py-5 text-[10px] font-headline font-black uppercase tracking-[0.2em] text-primary/60">Hora de Creación</th>
              <th className="px-8 py-5 text-[10px] font-headline font-black uppercase tracking-[0.2em] text-primary/60">REPORTADO EN</th>
              <th className="px-8 py-5 text-[10px] font-headline font-black uppercase tracking-[0.2em] text-primary/60">Agente</th>
              <th className="px-8 py-5 text-[10px] font-headline font-black uppercase tracking-[0.2em] text-primary/60">Estatus</th>
              <th className="px-8 py-5 text-[10px] font-headline font-black uppercase tracking-[0.2em] text-primary/60"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-variant/5">
            {filteredTickets.map((ticket) => {
              const estatus = String(ticket.estatusCaso || "").toLowerCase();
              return (
                <tr 
                  key={ticket.caso} 
                  className="group hover:bg-primary/[0.02] transition-colors cursor-pointer"
                >
                  <td className="px-8 py-6">
                    <Link 
                      href={`/cases/${ticket.caso || 'unknown'}`}
                      className="font-headline font-black text-primary hover:text-tertiary transition-colors text-sm underline decoration-primary/20 underline-offset-4"
                    >
                      {ticket.caso || ticket["NRO DE CASO"] || ticket["Caso"] || "#---"}
                    </Link>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs text-on-surface-variant font-bold">
                      {ticket.fecha?.split('T')[0]?.split(' ')[0]}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs text-on-surface-variant opacity-60 font-medium">{ticket.horaDeReporte}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-surface-container-low rounded-lg text-[10px] font-bold text-on-surface-variant opacity-70">
                      {ticket.reportadoEn || "WhatsApp"}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-surface-container-low border border-surface-variant/20 flex items-center justify-center text-[10px] font-black text-primary">
                        {ticket.analistaOperacionesTecnicas?.charAt(0) || "?"}
                      </div>
                      <span className="text-xs text-on-surface font-bold">{ticket.analistaOperacionesTecnicas}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`
                      px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                      ${estatus.includes('abier') ? 'bg-primary/10 text-primary' : 
                        estatus.includes('proce') ? 'bg-tertiary/10 text-tertiary' : 
                        'bg-surface-variant/30 text-on-surface-variant opacity-60'}
                    `}>
                      {ticket.estatusCaso}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 hover:bg-surface-container-low rounded-xl transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="w-4 h-4 text-on-surface-variant opacity-40" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredTickets.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center opacity-30">
            <Ticket className="w-16 h-16 mb-4" />
            <p className="font-headline font-black text-xl uppercase tracking-widest text-balance max-w-xs">no hay tickets para este dia</p>
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

