"use client";

import React from "react";
import { Search, Bell, Settings } from "lucide-react";

export function TopBar() {
  return (
    <header className="w-full sticky top-0 z-40 flex items-center justify-between px-8 py-4 bg-surface/85 backdrop-blur-xl transition-all">
      <div className="flex items-center gap-4">
        <div className="relative group">
          <span className="absolute inset-y-0 left-3 flex items-center text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search cases..."
            className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm w-80 focus:ring-2 focus:ring-primary/10 font-headline transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        
        <div className="h-8 w-px bg-surface-variant/30"></div>
        
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User avatar"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary/20 transition-all"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-surface"></span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-sm font-bold text-on-surface">Alex Thompson</span>
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold opacity-60 leading-none">
              Lead Resolver
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
