"use client";

import React, { useState } from "react";
import { RefreshCw, Check } from "lucide-react";
import { syncData } from "@/app/actions";
import { useRouter } from "next/navigation";

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
      className={`
        flex items-center justify-center p-4 rounded-2xl transition-all duration-300
        ${showSuccess 
          ? "bg-tertiary text-on-tertiary" 
          : "bg-surface-container-low text-on-surface-variant hover:bg-primary hover:text-white shadow-sm"
        }
        ${isSyncing ? "opacity-70 cursor-wait" : "active:scale-90"}
      `}
    >
      {isSyncing ? (
        <RefreshCw className="w-5 h-5 animate-spin" />
      ) : showSuccess ? (
        <Check className="w-5 h-5" />
      ) : (
        <RefreshCw className="w-5 h-5" />
      )}
    </button>
  );
}
