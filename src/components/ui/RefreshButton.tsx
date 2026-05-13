"use client";

import React, { useState } from "react";
import { RefreshCw, Check } from "lucide-react";
import { syncData } from "@/app/actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function RefreshButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleSync = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    const result = await syncData();
    
    if (result.success) {
      // Small delay to make the transition feel substantial
      setTimeout(() => {
        router.refresh();
        setIsSyncing(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }, 500);
    } else {
      setIsSyncing(false);
      alert("Error al sincronizar datos");
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={isSyncing}
      title={isSyncing ? "Sincronizando..." : showSuccess ? "¡Actualizado!" : "Actualizar ahora"}
      className={cn(
        "flex items-center gap-3 px-6 py-3.5 rounded-2xl transition-all duration-500 font-headline text-[11px] font-black uppercase tracking-[0.2em] shadow-xl",
        showSuccess 
          ? "bg-green-500 text-white shadow-green-200" 
          : "bg-primary text-white shadow-primary/20 hover:opacity-90 active:scale-95"
      )}
    >
      {isSyncing ? (
        <RefreshCw className="w-4 h-4 animate-spin" />
      ) : showSuccess ? (
        <Check className="w-4 h-4" />
      ) : (
        <RefreshCw className="w-4 h-4" />
      )}
      <span>{isSyncing ? "Sincronizando" : showSuccess ? "Sincronizado" : "Sincronizar Cloud"}</span>
    </button>
  );
}
