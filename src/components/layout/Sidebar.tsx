'use client'

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Settings,
  Bell,
  Zap,
  HelpCircle,
  Ticket,
  History,
  Users
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/components/providers/NotificationProvider"

export function Sidebar() {
  const { unreadCount } = useNotifications()
  const pathname = usePathname()

  const NavItem = ({ href, icon: Icon, label, badge }: any) => {
    const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href))
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all group relative",
          isActive
            ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]"
            : "text-on-surface-variant/70 hover:text-on-surface hover:bg-surface-container-low"
        )}
      >
        <div className="flex items-center gap-3.5">
          <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-primary/60 group-hover:text-primary")} />
          <span className="text-[13px] font-bold tracking-tight">{label}</span>
        </div>
        {badge && (
          <span className={cn(
            "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase",
            isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
          )}>
            {badge}
          </span>
        )}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
        )}
      </Link>
    )
  }

  return (
    <aside className="w-80 h-screen bg-surface-container-lowest border-r border-outline-variant/30 fixed left-0 top-0 flex flex-col z-50">
      {/* Premium Logo Header */}
      <div className="p-10 pb-6">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 bg-primary rounded-[18px] flex items-center justify-center shadow-2xl shadow-primary/40 relative overflow-hidden transition-transform group-hover:scale-110">
            <Zap className="text-white w-6 h-6 relative z-10" />
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
          <div>
            <h2 className="text-2xl font-headline font-black tracking-tighter text-on-surface uppercase leading-none">Control ATC</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">En línea</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 py-4 overflow-y-auto custom-scrollbar space-y-2">
        <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavItem href="/tickets" icon={Ticket} label="Tickets" badge="Live" />
        <NavItem href="/cases" icon={History} label="Trazabilidad de Casos" />
        <NavItem href="/groups" icon={Users} label="Cooperadores" />
        <NavItem href="/notifications" icon={Bell} label="Historial de Notificaciones" badge={unreadCount > 0 ? unreadCount : null} />
      </nav>

      {/* Bottom Profile / Settings */}
      <div className="p-8 border-t border-outline-variant/20 bg-surface-container-low/20">
        <div className="flex flex-col gap-2">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-on-surface-variant/60 hover:text-primary hover:bg-white transition-all group"
          >
            <Settings className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span className="text-xs font-bold uppercase tracking-widest">Ajustes</span>
          </Link>
          <Link
            href="/help"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-on-surface-variant/60 hover:text-primary hover:bg-white transition-all group"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Ayuda</span>
          </Link>
        </div>
      </div>
    </aside>
  )
}
