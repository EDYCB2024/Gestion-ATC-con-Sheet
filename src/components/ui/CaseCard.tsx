import React from "react";
import Link from "next/link";
import { ATCCase } from "@/lib/google-sheets";
import { Clock, AlertCircle } from "lucide-react";

interface CaseCardProps {
  atcCase: ATCCase;
}

export function CaseCard({ atcCase }: CaseCardProps) {
  const priorityColors = {
    High: "bg-error",
    Medium: "bg-tertiary",
    Low: "bg-on-surface-variant/30",
  };

  const statusColors = {
    "In Progress": "bg-primary-container/40 text-primary",
    "Pending Verification": "bg-tertiary-container/30 text-on-tertiary-container",
    "Escalated": "bg-error-container text-on-error-container font-bold",
    "On Hold": "bg-surface-variant text-on-surface-variant",
    "Resolved": "bg-tertiary-container text-on-tertiary-container",
  };

  // Map Spanish status if necessary or use as is
  const displayStatus = atcCase.estatusCaso || "In Progress";

  return (
    <Link href={`/cases/${atcCase.caso}`} className="block">
      <div className="bg-surface-container-lowest rounded-xl p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg shadow-sm flex items-center gap-6 group">
        {/* Vertical status indicator - base on category if exists */}
        <div className={`w-1 rounded-full self-stretch ${atcCase.categoriaDeFalla === "Critical" ? "bg-error" : "bg-tertiary"}`}></div>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-xs font-headline font-black text-primary group-hover:underline uppercase">
              #{atcCase.caso}
            </span>
            <span className={`text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant`}>
              {displayStatus}
            </span>
          </div>
          <h3 className="font-headline font-bold text-lg text-on-surface line-clamp-1">
            {atcCase.nombreComercio}
          </h3>
          <p className="text-sm text-on-surface-variant opacity-70 line-clamp-1">
            {atcCase.ciudad}, {atcCase.estado} • {atcCase.operadora}
          </p>
        </div>

        <div className="flex items-center gap-8 text-right pr-4">
          <div className="hidden md:block">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-40 mb-1">
              Falla
            </p>
            <p className="text-sm font-semibold text-on-surface">{atcCase.categoriaDeFalla}</p>
          </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5 text-on-surface-variant opacity-60">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs font-bold uppercase tracking-tighter">{atcCase.tiempo || atcCase.horaDeReporte}</span>
              </div>
              
              {/* Vencimiento Badge */}
              {(() => {
                const val = atcCase.vencimientoCaso;
                if (!val || val === "") return null;
                let displayDate = val;
                if (typeof val === 'number' || (!isNaN(Number(val)) && val !== "")) {
                  const dateNum = Number(val);
                  if (dateNum > 30000) {
                    const date = new Date((dateNum - 25569) * 86400 * 1000);
                    displayDate = date.toISOString().split('T')[0];
                  }
                }
                return (
                  <div className="flex items-center gap-1.5 text-error font-black px-2 py-0.5 bg-error/5 rounded-md">
                    <span className="text-[9px] uppercase tracking-tighter">Vence: {displayDate}</span>
                  </div>
                );
              })()}

              {atcCase.categoriaDeFalla === "Critical" && (
                <div className="flex items-center gap-1 text-error">
                  <AlertCircle className="w-3.5 h-3.5 fill-error/10" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Alerta</span>
                </div>
              )}
            </div>
        </div>
      </div>
    </Link>
  );
}
