"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Bell, X, CheckCircle, Info, AlertTriangle } from "lucide-react";

export type NotificationType = "success" | "info" | "warning" | "error";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (title: string, message: string, type?: NotificationType) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ContextType<any> }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [sound, setSound] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Pleasant notification sound
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    setSound(audio);
  }, []);

  const addNotification = useCallback((title: string, message: string, type: NotificationType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification: Notification = {
      id,
      title,
      message,
      type,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Play sound
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.warn("Audio play blocked by browser", e));
    }
  }, [sound]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, clearAll, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
