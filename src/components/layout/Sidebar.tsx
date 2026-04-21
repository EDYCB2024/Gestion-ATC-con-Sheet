"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  HelpCircle,
  Table,
  Users2,
  Activity,
  Wrench,
  Ticket
} from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Monitoreo", icon: Activity, href: "/" },
  { label: "Casos (Tabla)", icon: Table, href: "/cases" },
  { label: "Agentes", icon: Users2, href: "/agents" },
  { label: "Servicio Técnico", icon: Wrench, href: "/technical-service" },
  { label: "Tickets", icon: Ticket, href: "/tickets" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low flex flex-col p-6 z-50">
      <div className="flex items-center gap-3 mb-10 pl-2">
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-sm">
          <LayoutDashboard className="text-white w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h2 className="font-headline font-black text-on-surface leading-tight tracking-tight">Editorial ATC</h2>
          <span className="text-[10px] font-headline font-black uppercase tracking-[0.2em] text-primary opacity-50 leading-none">
            Manager
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out font-headline text-[11px] font-black uppercase tracking-[0.15em]
                ${isActive 
                  ? "bg-surface-container-lowest text-primary shadow-[0_4px_12px_rgba(0,0,0,0.03)]" 
                  : "text-on-surface-variant opacity-60 hover:opacity-100 hover:bg-surface-container-low/80"
                }
              `}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-on-surface-variant"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 pt-6 border-t border-surface-variant/20">
        <Link
          href="/help"
          className="flex items-center gap-4 px-4 py-2 text-on-surface-variant opacity-40 hover:opacity-100 transition-all font-headline text-[10px] font-black uppercase tracking-widest"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help Center</span>
        </Link>
      </div>
    </aside>
  );
}
