import React from "react";
import { Wrench, Hammer, Construction, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TechnicalServicePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-10">
      <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Animated Icon Container */}
        <div className="relative inline-block">
          <div className="w-32 h-32 bg-primary/10 rounded-[3rem] flex items-center justify-center relative z-10 mx-auto">
            <Construction className="w-16 h-16 text-primary animate-bounce" />
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-error/10 rounded-2xl flex items-center justify-center z-20">
            <Hammer className="w-6 h-6 text-error rotate-12" />
          </div>
          <div className="absolute -bottom-2 -left-4 w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center z-20">
            <Wrench className="w-5 h-5 text-secondary -rotate-12" />
          </div>
          {/* Decorative rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary/5 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-primary/5 rounded-full"></div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="font-headline font-black text-5xl tracking-tight text-on-surface uppercase">
            Sitio en <span className="text-primary">Construcción</span>
          </h1>
          <p className="text-on-surface-variant text-lg font-medium max-w-md mx-auto opacity-70">
            Estamos trabajando arduamente para brindarte la mejor experiencia en la gestión de servicios técnicos. ¡Vuelve pronto!
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-3 bg-surface-container-highest text-on-surface px-8 py-4 rounded-[1.5rem] font-headline font-black text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-on-primary transition-all shadow-xl shadow-black/5 hover:shadow-primary/20 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Volver al Panel Principal
          </Link>
        </div>

        {/* Progress indicator */}
        <div className="max-w-xs mx-auto pt-10">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Progreso del Módulo</span>
            <span className="text-[10px] font-black text-primary">65%</span>
          </div>
          <div className="h-1.5 w-full bg-surface-variant/20 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full w-[65%] shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
