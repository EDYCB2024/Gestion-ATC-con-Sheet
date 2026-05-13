'use client'

import { useNotifications, Notification, NotificationType } from "@/components/providers/NotificationProvider"
import { 
  Bell, 
  CheckCircle, 
  Info, 
  AlertTriangle, 
  Trash2, 
  Clock, 
  Calendar, 
  ArrowRight,
  LucideIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function NotificationsPage() {
  const { notifications, markAsRead, clearAll, unreadCount } = useNotifications()

  const typeStyles: Record<NotificationType, { icon: LucideIcon, color: string, bg: string, border: string }> = {
    success: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50", border: "border-green-100" },
    info: { icon: Info, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" },
    warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" },
    error: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <header className="px-10 py-8 border-b border-outline-variant/10 bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-headline font-black text-on-surface tracking-tight uppercase">Centro de Notificaciones</h1>
            </div>
            <p className="text-body-md text-on-surface-variant/70 font-medium">
              Gestione las alertas del sistema y actualizaciones en tiempo real.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-2xl transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Limpiar Todo
              </button>
            )}
            <div className="px-4 py-2 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
              {unreadCount} Pendientes
            </div>
          </div>
        </div>
      </header>

      <main className="px-10 py-10">
        <div className="max-w-4xl mx-auto space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-md rounded-[40px] border border-outline-variant/30 p-20 text-center shadow-sm">
              <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-10 h-10 text-on-surface-variant/20" />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2">Bandeja Vacía</h3>
              <p className="text-on-surface-variant/60 font-medium">
                No tiene notificaciones pendientes en este momento.
              </p>
            </div>
          ) : (
            notifications.map((notification: Notification) => {
              const style = typeStyles[notification.type] || typeStyles.info
              const Icon = style.icon

              return (
                <div
                  key={notification.id}
                  className={cn(
                    "group relative bg-white/80 backdrop-blur-md p-8 rounded-[32px] border transition-all hover:shadow-md flex items-start gap-6",
                    notification.read ? "border-outline-variant/30 opacity-60" : cn("border-primary/20 shadow-sm", style.border)
                  )}
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", style.bg)}>
                    <Icon className={cn("w-7 h-7", style.color)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-black text-on-surface uppercase tracking-tight">{notification.title}</h3>
                      <div className="flex items-center gap-4 text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(notification.timestamp, "dd MMM yyyy", { locale: es })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {format(notification.timestamp, "HH:mm")}
                        </span>
                      </div>
                    </div>
                    <p className="text-on-surface-variant font-medium leading-relaxed mb-6">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                       <span className={cn(
                         "text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full",
                         notification.read ? "bg-surface-container-low text-on-surface-variant/40" : "bg-primary/10 text-primary"
                       )}>
                         {notification.read ? "Leída" : "Nueva Notificación"}
                       </span>
                       
                       {!notification.read && (
                         <button 
                           onClick={() => markAsRead(notification.id)}
                           className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:underline group/btn"
                         >
                           Marcar como leída
                           <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                         </button>
                       )}
                    </div>
                  </div>

                  {!notification.read && (
                    <div className="absolute top-8 right-8 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                  )}
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}
