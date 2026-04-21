"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface CalendarPopoverProps {
  onSelectDate: (date: Date) => void;
  onClose: () => void;
}

export function CalendarPopover({ onSelectDate, onClose }: CalendarPopoverProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const days = [];
  const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const startDay = firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  // Padding for start of month
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
  }

  // Days of month
  for (let d = 1; d <= totalDays; d++) {
    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), d).toDateString();
    
    days.push(
      <button
        key={d}
        onClick={() => {
          onSelectDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), d));
          onClose();
        }}
        className={`h-8 w-8 flex items-center justify-center text-[10px] font-bold rounded-lg transition-all
          ${isToday ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'hover:bg-primary/10 text-on-surface'}
        `}
      >
        {d}
      </button>
    );
  }

  return (
    <div className="absolute top-full mt-2 right-0 z-[60] bg-surface-container-lowest border border-surface-variant/30 rounded-2xl shadow-2xl p-4 w-64 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-1 hover:bg-surface-container-low rounded-lg transition-colors">
          <ChevronLeft className="w-4 h-4 text-on-surface-variant" />
        </button>
        <span className="text-[11px] font-headline font-black uppercase tracking-widest text-on-surface">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
        <button onClick={handleNextMonth} className="p-1 hover:bg-surface-container-low rounded-lg transition-colors">
          <ChevronRight className="w-4 h-4 text-on-surface-variant" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(day => (
          <div key={day} className="h-8 w-8 flex items-center justify-center text-[9px] font-black text-on-surface-variant opacity-30">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>

      <div className="mt-4 pt-4 border-t border-surface-variant/10">
        <button 
          onClick={() => {
            onSelectDate(new Date());
            onClose();
          }}
          className="w-full py-2 text-[9px] font-headline font-black uppercase tracking-[0.2em] text-primary hover:bg-primary/5 rounded-lg transition-colors"
        >
          Ir a Hoy
        </button>
      </div>
    </div>
  );
}
