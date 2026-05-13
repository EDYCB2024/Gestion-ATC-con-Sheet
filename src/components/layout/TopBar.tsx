"use client";

import React, { useState } from "react";

import { 
  Bell, 
  LogOut, 
  Menu, 
  User, 
  Search, 
  RefreshCw, 
  X, 
  CheckCircle, 
  Info, 
  AlertTriangle, 
  Trash2, 
  Clock, 
  ArrowRight 
} from "lucide-react";
import { useNotifications } from "@/components/providers/NotificationProvider";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title?: string;
}

export function TopBar({ title = "Portal de Control" }: TopBarProps) {
  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
  const [isSearching, setIsSearching] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-30 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/30 flex justify-between items-center w-full px-8 py-4 shadow-sm">
      <div className="flex items-center gap-6">
        <button className="p-2.5 -ml-2 text-primary hover:bg-primary/5 rounded-2xl lg:hidden transition-all active:scale-95">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-xl font-headline font-black text-on-surface tracking-tighter uppercase leading-none">{title}</h1>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.1em] text-on-surface-variant/40">Sistema Operativo</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Global Search Interface - CRM Style */}
        <div className="relative hidden xl:block group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/30 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar en el ecosistema..."
            className="bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl pl-12 pr-6 py-2.5 text-[12px] font-bold text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all w-80 shadow-inner"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pr-6 border-r border-outline-variant/20 relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={cn(
                "p-2.5 rounded-2xl transition-all relative group",
                isNotificationsOpen ? "bg-primary text-white" : "text-on-surface-variant/40 hover:text-primary hover:bg-primary/5"
              )}
            >
              <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" />
              {unreadCount > 0 && (
                <span className={cn(
                  "absolute top-2.5 right-2.5 w-4 h-4 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 shadow-sm",
                  isNotificationsOpen ? "bg-white text-primary border-primary" : "bg-primary border-white"
                )}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsNotificationsOpen(false)} 
                />
                <div className="absolute top-full right-0 mt-4 w-96 bg-surface-container-lowest rounded-[32px] border border-outline-variant/30 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low/30">
                    <h3 className="font-headline font-black text-xs uppercase tracking-[0.2em] text-on-surface">Notificaciones</h3>
                    {notifications.length > 0 && (
                      <button 
                        onClick={clearAll}
                        className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 px-3 py-1 rounded-full transition-all"
                      >
                        Limpiar Todo
                      </button>
                    )}
                  </div>

                  <div className="max-h-[450px] overflow-y-auto custom-scrollbar bg-surface-container-lowest">
                    {notifications.length === 0 ? (
                      <div className="py-20 px-8 text-center flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-6 relative overflow-hidden group/empty">
                          <Bell className="w-10 h-10 text-on-surface-variant/20 transition-transform group-hover/empty:rotate-12" />
                          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/empty:opacity-100 transition-opacity" />
                        </div>
                        <h4 className="text-[11px] font-black text-on-surface uppercase tracking-[0.2em] mb-2">Bandeja de Entrada Vacía</h4>
                        <p className="text-[10px] font-medium text-on-surface-variant/40 leading-relaxed max-w-[200px] mx-auto">
                          No tienes alertas pendientes ni mensajes del sistema en este momento.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-outline-variant/5">
                        {notifications.slice(0, 10).map((notification) => (
                          <div 
                            key={notification.id} 
                            className={cn(
                              "p-5 hover:bg-surface-container-low transition-colors group/item relative",
                              !notification.read && "bg-primary/[0.02]"
                            )}
                          >
                            <div className="flex gap-4">
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                notification.type === 'success' ? "bg-green-50 text-green-500" :
                                notification.type === 'warning' ? "bg-amber-50 text-amber-500" :
                                notification.type === 'error' ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                              )}>
                                {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
                                 notification.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                                 notification.type === 'error' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-black text-on-surface uppercase tracking-tight mb-1">{notification.title}</p>
                                <p className="text-[11px] text-on-surface-variant/70 line-clamp-2 leading-relaxed mb-2 font-medium">{notification.message}</p>
                                <div className="flex items-center gap-3">
                                  <span className="text-[9px] font-black text-on-surface-variant/30 uppercase flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {format(notification.timestamp, "HH:mm")}
                                  </span>
                                  {!notification.read && (
                                    <button 
                                      onClick={() => markAsRead(notification.id)}
                                      className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                                    >
                                      Marcar leída
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                            {!notification.read && (
                              <div className="absolute top-5 right-5 w-1.5 h-1.5 bg-primary rounded-full" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link 
                    href="/notifications"
                    onClick={() => setIsNotificationsOpen(false)}
                    className="p-4 bg-surface-container-low/50 block text-center text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-white transition-all border-t border-outline-variant/10"
                  >
                    Ver todas las notificaciones
                  </Link>
                </div>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-4 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-black uppercase text-primary leading-none tracking-tight">Administrador</p>
              <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest mt-1">Nivel: Super Usuario</p>
            </div>
            
            <div className="relative group cursor-pointer">
               <div className="h-10 w-10 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-black text-[13px] shadow-sm transition-all group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:rotate-3">
                 AD
               </div>
               <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm" />
            </div>
            
            <button 
              onClick={handleLogout}
              className="ml-2 p-2.5 text-on-surface-variant/30 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90 group"
              title="Cerrar Sesión"
            >
              <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
