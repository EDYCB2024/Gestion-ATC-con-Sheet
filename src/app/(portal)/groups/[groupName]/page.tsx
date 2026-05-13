import React from "react";
import { getCases } from "@/lib/google-sheets";
import Link from "next/link";
import { 
  ChevronRight, 
  Users, 
  Mail, 
  Phone, 
  Ticket, 
  Building2, 
  User as UserIcon,
  Search,
  ArrowLeft,
  Plus,
  UserPlus
} from "lucide-react";
import { RefreshButton } from "@/components/ui/RefreshButton";

export default async function GroupPage(props: {
  params: Promise<{ groupName: string }>;
}) {
  const params = await props.params;
  const decodedGroupName = decodeURIComponent(params.groupName).replace(/-/g, ' ');
  
  const allCases = await getCases();
  
  // Filter cases by asignarGrupo
  const groupCases = allCases.filter(c => {
    const group = String(c.asignarGrupo || "").toLowerCase();
    const target = decodedGroupName.toLowerCase();
    return group === target || group.includes(target);
  });

  return (
    <div className="p-10 max-w-[1600px] mx-auto w-full space-y-10">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-surface-variant/20">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Link 
              href="/tickets" 
              className="p-2 hover:bg-surface-container-low rounded-xl transition-colors text-on-surface-variant"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-primary/5 px-3 py-1 rounded-full">
              Cooperador
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center">
              <Users className="text-primary w-8 h-8" />
            </div>
            <div>
              <h1 className="font-headline font-black text-4xl tracking-tight text-on-surface capitalize">
                {decodedGroupName}
              </h1>
              <p className="text-on-surface-variant opacity-40 text-sm font-medium mt-1 uppercase tracking-widest">
                {groupCases.length} Casos Asignados
              </p>
            </div>
          </div>
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

      {/* Table Section */}
      <div className="bg-surface-container-lowest rounded-[40px] border border-surface-variant/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5 border-b border-surface-variant/20">
                <th className="px-8 py-6 text-[10px] font-headline font-black uppercase tracking-[0.2em] text-primary/60">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-3 h-3" />
                    Nro
                  </div>
                </th>
                <th className="px-8 py-6 text-[10px] font-headline font-black uppercase tracking-[0.2em] text-primary/60">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3 h-3" />
                    Cooperador
                  </div>
                </th>
                <th className="px-8 py-6 text-[10px] font-headline font-black uppercase tracking-[0.2em] text-primary/60">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-3 h-3" />
                    Agente
                  </div>
                </th>
                <th className="px-8 py-6 text-[10px] font-headline font-black uppercase tracking-[0.2em] text-primary/60">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    Número Tlf
                  </div>
                </th>
                <th className="px-8 py-6 text-[10px] font-headline font-black uppercase tracking-[0.2em] text-primary/60">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3" />
                    Correo
                  </div>
                </th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant/5">
              {groupCases.map((c, index) => (
                <tr 
                  key={`${c.caso}-${index}`} 
                  className="group hover:bg-primary/[0.02] transition-colors"
                >
                  <td className="px-8 py-6 font-headline font-black text-primary text-sm">
                    #{c.caso}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface line-clamp-1">{c.nombreComercio}</span>
                      <span className="text-[10px] font-medium text-on-surface-variant opacity-40 uppercase tracking-wider">{c.rif}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container-low border border-surface-variant/20 flex items-center justify-center text-[10px] font-black text-primary">
                        {c.analistaOperacionesTecnicas?.charAt(0) || "?"}
                      </div>
                      <span className="text-xs font-bold text-on-surface">{c.analistaOperacionesTecnicas || "No asignado"}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
                      <Phone className="w-3.5 h-3.5 opacity-30" />
                      {c.telefonoContacto}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
                      <Mail className="w-3.5 h-3.5 opacity-30" />
                      {c.correo || "---"}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link 
                      href={`/cases/${c.caso}`}
                      className="p-2.5 bg-surface-container-low rounded-xl hover:bg-primary hover:text-white transition-all inline-flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {groupCases.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-surface-container-low rounded-[32px] flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-on-surface-variant opacity-20" />
              </div>
              <p className="font-headline font-black text-xl uppercase tracking-widest text-on-surface-variant opacity-30 max-w-xs">
                No hay casos asignados a este grupo
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
