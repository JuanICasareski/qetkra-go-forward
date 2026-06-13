import { Bell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/products/meta";
import { useStore } from "@/store/context";

// Centro de notificaciones in-app. Simula las alertas que en producción
// emitiría la cola de mensajes (notificación al staff, alerta al cliente).
export function NotificationsBell() {
  const { role, notifications, markAllRead } = useStore();

  const mine = notifications
    .filter((n) => n.to === role)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const unread = mine.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <p className="text-sm font-semibold">Notificaciones</p>
          {unread > 0 && (
            <Button variant="ghost" size="sm" onClick={() => markAllRead(role)}>
              Marcar leídas
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {mine.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Sin notificaciones.
            </p>
          ) : (
            mine.map((n) => (
              <div key={n.id} className="border-b px-3 py-2 last:border-b-0">
                <div className="flex items-start gap-2">
                  {!n.read && (
                    <Badge variant="secondary" className="mt-0.5 px-1.5 text-[10px]">
                      Nueva
                    </Badge>
                  )}
                  <p
                    className={[
                      "text-sm leading-snug",
                      n.read ? "text-muted-foreground" : "font-medium",
                    ].join(" ")}
                  >
                    {n.message}
                  </p>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatDate(n.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
