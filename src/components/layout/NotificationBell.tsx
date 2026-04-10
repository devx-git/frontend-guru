"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, X, Mail, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notificacionService, Notificacion } from "@/services/notificacion.service";

export function NotificationBell() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [open, setOpen] = useState(false);
  const [nonLeidas, setNonLeidas] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cargarNotificaciones();
    
    // Escuchar cambios en localStorage (para nuevas notificaciones)
    const handleStorageChange = () => {
      cargarNotificaciones();
    };
    window.addEventListener("storage", handleStorageChange);
    
    // Intervalo para recargar notificaciones cada 30 segundos
    const interval = setInterval(cargarNotificaciones, 30000);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const cargarNotificaciones = () => {
    // Cargar desde localStorage (simulación)
    const guardadas = localStorage.getItem("notificaciones");
    const notis = guardadas ? JSON.parse(guardadas) : [];
    setNotificaciones(notis);
    setNonLeidas(notis.filter((n: Notificacion) => !n.leida).length);
  };

  const marcarLeida = (id: string) => {
    const nuevas = notificaciones.map(n => 
      n.id === id ? { ...n, leida: true } : n
    );
    setNotificaciones(nuevas);
    localStorage.setItem("notificaciones", JSON.stringify(nuevas));
    setNonLeidas(nuevas.filter(n => !n.leida).length);
  };

  const marcarTodasLeidas = () => {
    const nuevas = notificaciones.map(n => ({ ...n, leida: true }));
    setNotificaciones(nuevas);
    localStorage.setItem("notificaciones", JSON.stringify(nuevas));
    setNonLeidas(0);
  };

  const eliminarNotificacion = (id: string) => {
    const nuevas = notificaciones.filter(n => n.id !== id);
    setNotificaciones(nuevas);
    localStorage.setItem("notificaciones", JSON.stringify(nuevas));
    setNonLeidas(nuevas.filter(n => !n.leida).length);
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcono = (tipo: string) => {
    switch(tipo) {
      case "PREDICCION":
        return <Trophy className="w-4 h-4 text-green-500" />;
      case "GURU_GANADOR":
        return <Trophy className="w-4 h-4 text-amber-500" />;
      default:
        return <Mail className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {nonLeidas > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50 overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-700">Notificaciones</h3>
            {nonLeidas > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-blue-600"
                onClick={marcarTodasLeidas}
              >
                Marcar todas como leídas
              </Button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notificaciones.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No hay notificaciones</p>
              </div>
            ) : (
              notificaciones.map((noti) => (
                <div
                  key={noti.id}
                  className={`p-3 border-b hover:bg-gray-50 transition-colors ${!noti.leida ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getIcono(noti.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{noti.titulo}</p>
                      <p className="text-xs text-gray-500 mt-1">{noti.mensaje}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(noti.fecha_creacion).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {!noti.leida && (
                        <button
                          onClick={() => marcarLeida(noti.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Marcar como leída"
                        >
                          <Check className="w-3 h-3 text-green-500" />
                        </button>
                      )}
                      <button
                        onClick={() => eliminarNotificacion(noti.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Eliminar"
                      >
                        <X className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}