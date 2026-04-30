"use client";

import React from "react";
import { Bell, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export function TopBar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full sticky top-0 z-40 flex items-center justify-between px-8 py-4 bg-surface/85 backdrop-blur-xl transition-all">
      <div className="flex items-center gap-4">
        {/* Search removed by request */}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
          </button>
          <button 
            onClick={toggleTheme}
            className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors flex items-center gap-2 group"
            title={theme === 'light' ? 'Activar Modo Oscuro' : 'Activar Modo Claro'}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 group-hover:text-primary transition-colors" />
            ) : (
              <Sun className="w-5 h-5 group-hover:text-primary transition-colors" />
            )}
          </button>
        </div>
        
        <div className="h-8 w-px bg-surface-variant/30"></div>
        
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-primary-container/40 flex items-center justify-center font-headline font-black text-primary text-xs shadow-inner ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
              AC
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-surface"></span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-sm font-bold text-on-surface">Admin Central</span>
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold opacity-60 leading-none">
              Lead Resolver
            </span>
          </div>
        </div>

        <div className="h-8 w-px bg-surface-variant/30"></div>

        <button 
          onClick={() => window.location.href = '/login'}
          className="p-2 text-on-surface-variant hover:bg-error/10 hover:text-error rounded-full transition-colors flex items-center gap-2 group"
          title="Cerrar Sesión"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
