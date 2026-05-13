import React from "react";
import { getCases } from "@/lib/google-sheets";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  Circle
} from "lucide-react";


export default async function CasesTablePage(props: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams.page) || 1;
  const query = searchParams.q?.toLowerCase() || "";
  const PAGE_SIZE = 10;

  const allCases = await getCases();
  
  // LOGIC: Filtrar por búsqueda si existe query
  const filteredCases = allCases.filter(c => {
    if (!query) return true;
    return (
      String(c.rif || "").toLowerCase().includes(query) ||
      String(c.nombreComercio || "").toLowerCase().includes(query) ||
      String(c.serial || "").toLowerCase().includes(query) ||
      String(c.caso || "").toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredCases.length / PAGE_SIZE);
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="p-10 space-y-10 max-w-[1600px] mx-auto w-full">
      {/* 1. Header Area */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-surface-variant/20">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-primary/5 px-3 py-1 rounded-full">
              Base de Datos
            </span>
            <span className="text-on-surface-variant opacity-20">/</span>
            <span className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">
              {filteredCases.length} Registros Encontrados
            </span>
          </div>
          <h1 className="font-headline font-black text-5xl tracking-tight text-on-surface">
            Control de Casos
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <form action="/cases" method="GET" className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant opacity-30 group-focus-within:opacity-100 transition-opacity" />
            <input
              type="text"
              name="q"
              defaultValue={searchParams.q}
              placeholder="Buscar por RIF, Comercio o Serial..."
              className="bg-surface-container-low border-none rounded-2xl pl-12 pr-6 py-4 text-xs font-bold w-80 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </form>
          <button className="bg-surface-container-low p-4 rounded-2xl hover:bg-surface-container-high transition-colors">
            <Filter className="w-4 h-4 text-on-surface-variant" />
          </button>
          <div className="h-10 w-px bg-surface-variant/20 mx-2 hidden md:block"></div>

        </div>
      </header>

      {/* 2. Table Section */}
      <div className="bg-surface-container-lowest rounded-[32px] overflow-hidden border border-surface-variant/10 shadow-sm">
        <div className="overflow-x-auto h-[600px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[2000px]">
            <thead className="sticky top-0 z-10 bg-surface-container-lowest border-b border-surface-variant/20">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40 sticky left-0 bg-surface-container-lowest z-20">#Ticket</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">FECHA</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">SERIAL</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">OPERADORA</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">PROVEEDOR WIFI</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">REPORTADO EN</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">RIF</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">NOMBRE COMERCIO</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">HORA DE REPORTE</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">HORA DE ATENCION</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">TIEMPO</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">PERSONA CONTACTO</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">TELEFONO CONTACTO</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">CIUDAD</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">ESTADO</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">REPORTADO POR</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">CATEGORIA DE FALLA</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">FALLA REPORTADA CLIENTE</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">ANALISTA OPERACIONES TÉCNICAS</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">ESTATUS CASO</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">OBSERVACIONES</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">OBSERVACION 2</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">OBSERVACION 3</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">VENCIMIENTO CASO</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40 sticky right-0 bg-surface-container-lowest z-20">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant/10">
              {paginatedCases.map((c, index) => (
                <tr key={`${c.caso}-${index}`} className="hover:bg-surface-container-low/30 transition-colors group">
                  {/* [1] CASO # */}
                  <td className="p-6 font-headline font-black text-sm text-primary sticky left-0 bg-white/80 backdrop-blur-md z-10">{c.caso}</td>

                  {/* [2] FECHA */}
                  <td className="p-6 font-medium text-xs text-on-surface-variant">
                    {(() => {
                      const val = c.fecha;
                      if (val === undefined || val === null || val === "") return "N/A";
                      
                      // Si ya parece una fecha ISO (contiene T o -)
                      if (typeof val === 'string' && (val.includes('T') || val.includes('-'))) {
                        return val.split('T')[0];
                      }

                      const numVal = Number(val);
                      if (!isNaN(numVal) && numVal > 30000) {
                        try {
                          const date = new Date((numVal - 25569) * 86400 * 1000);
                          return date.toISOString().split('T')[0];
                        } catch (e) {}
                      }
                      
                      return val.toString();
                    })()}
                  </td>

                  {/* [3] SERIAL */}
                  <td className="p-6 font-medium text-xs text-on-surface-variant">{c.serial}</td>

                  {/* [4] OPERADORA */}
                  <td className="p-6 font-medium text-xs text-on-surface-variant">{c.operadora}</td>

                  {/* [5] PROVEEDOR WIFI */}
                  <td className="p-6 font-medium text-xs text-on-surface-variant">{c.proveedorWifi}</td>

                  {/* [6] REPORTADO EN */}
                  <td className="p-6 font-medium text-xs text-on-surface-variant">{c.reportadoEn}</td>

                  {/* [7] RIF */}
                  <td className="p-6 font-medium text-xs text-on-surface-variant">{c.rif}</td>

                  {/* [8] NOMBRE COMERCIO */}
                  <td className="p-6 font-bold text-sm text-on-surface truncate max-w-[200px]">{c.nombreComercio}</td>

                  {/* [9] HORA DE REPORTE */}
                  <td className="p-6 font-medium text-xs text-on-surface-variant">{c.horaDeReporte}</td>

                  {/* [10] HORA DE ATENCION */}
                  <td className="p-6 font-medium text-xs text-on-surface-variant">{c.horaDeAtencion}</td>

                  {/* [11] TIEMPO */}
                  <td className="p-6 font-medium text-xs text-on-surface-variant">{c.tiempo}</td>

                  {/* [12] PERSONA CONTACTO */}
                  <td className="p-6 font-medium text-xs text-on-surface-variant">{c.personaContacto}</td>

                  {/* [13] TELEFONO CONTACTO */}
                  <td className="p-6 font-medium text-xs text-on-surface-variant">{c.telefonoContacto}</td>

                  {/* [14] CIUDAD */}
                  <td className="p-6 font-medium text-xs text-on-surface-variant">{c.ciudad}</td>

                  {/* [15] ESTADO */}
                  <td className="p-6 font-medium text-xs text-on-surface-variant">{c.estado}</td>

                  {/* [16] REPORTADO POR */}
                  <td className="p-6 font-medium text-xs text-on-surface-variant">{c.reportadoPor}</td>

                  {/* [17] CATEGORIA DE FALLA */}
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${c.categoriaDeFalla === "Critical" ? "bg-error/10 text-error" : "bg-surface-variant/50 text-on-surface-variant"
                      }`}>
                      {c.categoriaDeFalla}
                    </span>
                  </td>

                  {/* [18] FALLA REPORTADA CLIENTE */}
                  <td className="p-6 font-medium text-xs text-on-surface-variant truncate max-w-[200px]">{c.fallaReportadaCliente}</td>

                  {/* [19] ANALISTA OPERACIONES TÉCNICAS */}
                  <td className="p-6 font-bold text-xs text-on-surface opacity-70">{c.analistaOperacionesTecnicas}</td>

                  {/* [20] ESTATUS CASO */}
                  <td className="p-6"><StatusBadge status={c.estatusCaso} /></td>

                  {/* [21] OBSERVACIONES */}
                  <td className="p-6 font-medium text-xs text-on-surface-variant truncate max-w-[200px]">{c.observaciones}</td>

                  {/* [22] OBSERVACION 2 */}
                  <td className="p-6 font-medium text-xs text-on-surface-variant">{c.observacion2}</td>

                  {/* [23] OBSERVACION 3 */}
                  <td className="p-6 font-medium text-xs text-on-surface-variant">{c.observacion3}</td>

                  {/* [24] VENCIMIENTO CASO */}
                  <td className="p-6 font-bold text-xs text-error opacity-60">
                    {(() => {
                      const val = c.vencimientoCaso;
                      if (val === undefined || val === null || val === "") return "N/A";
                      
                      const numVal = Number(val);
                      if (!isNaN(numVal) && numVal > 30000) {
                        try {
                          const date = new Date((numVal - 25569) * 86400 * 1000);
                          return date.toISOString().split('T')[0];
                        } catch (e) {}
                      }
                      
                      return String(val);
                    })()}
                  </td>

                  {/* ACCIONES */}
                  <td className="p-6 text-center sticky right-0 bg-white/80 backdrop-blur-md z-10">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/cases/${c.caso}`}
                        className="p-2 bg-surface-container-low rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedCases.length === 0 && (
            <div className="p-20 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center">
                <Search className="w-6 h-6 text-on-surface-variant opacity-20" />
              </div>
              <p className="text-on-surface-variant opacity-40 font-bold uppercase tracking-widest text-xs">
                No hay datos disponibles en la hoja 'DATA'
              </p>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="bg-surface-container-lowest p-6 border-t border-surface-variant/10 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">
            <span>Página {currentPage} de {totalPages}</span>
            <div className="h-4 w-px bg-surface-variant/20"></div>
            <span>Mostrando {paginatedCases.length} de {filteredCases.length} casos</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={currentPage > 1 ? `/cases?page=${currentPage - 1}${query ? `&q=${query}` : ''}` : "#"}
              className={`p-3 rounded-xl transition-all ${currentPage === 1
                ? "opacity-20 cursor-not-allowed"
                : "bg-surface-container-low hover:bg-primary hover:text-white"
                }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>

            <Link
              href={currentPage < totalPages ? `/cases?page=${currentPage + 1}${query ? `&q=${query}` : ''}` : "#"}
              className={`p-3 rounded-xl transition-all ${currentPage >= totalPages
                ? "opacity-20 cursor-not-allowed"
                : "bg-surface-container-low hover:bg-primary hover:text-white"
                }`}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = (status || "Abierto").toLowerCase();

  if (normalized.includes("cerrado") || normalized.includes("resolved") || normalized.includes("resuelto")) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-tertiary/10 text-tertiary rounded-full w-fit">
        <div className="w-1.5 h-1.5 rounded-full bg-tertiary shadow-[0_0_8px_rgba(var(--tertiary),0.5)]"></div>
        <span className="text-[10px] font-black uppercase tracking-widest">Resuelto</span>
      </div>
    );
  }

  if (normalized.includes("progreso") || normalized.includes("progress") || normalized.includes("atencion")) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-[#f59e0b15] text-[#d97706] rounded-full w-fit">
        <Circle className="w-2 h-2 fill-current animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest">En Curso</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-surface-variant/40 text-on-surface-variant rounded-full w-fit">
      <div className="w-1.5 h-1.5 rounded-full bg-on-surface-variant opacity-40"></div>
      <span className="text-[10px] font-black uppercase tracking-widest">{status}</span>
    </div>
  );
}
