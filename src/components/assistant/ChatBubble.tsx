"use client";

import React, { useState } from "react";
import { Headphones, MessageSquare } from "lucide-react";
import { ChatWindow } from "./ChatWindow";

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      {isOpen && (
        <ChatWindow onClose={() => setIsOpen(false)} />
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95
          ${isOpen 
            ? "bg-surface-container-lowest text-primary rotate-90" 
            : "bg-primary text-on-primary hover:shadow-primary/20"
          }
        `}
      >
        {isOpen ? (
          <Headphones className="w-8 h-8" />
        ) : (
          <div className="relative">
            <Headphones className="w-8 h-8" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full border-2 border-primary animate-pulse"></span>
          </div>
        )}
      </button>

      {!isOpen && (
        <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-surface/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-surface-variant/20 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          <p className="text-xs font-headline font-black text-on-surface-variant uppercase tracking-widest">
            ¿Necesitas ayuda técnica?
          </p>
        </div>
      )}
    </div>
  );
}
