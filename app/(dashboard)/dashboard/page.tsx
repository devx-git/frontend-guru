"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  TrendingUp, 
  Trophy, 
  Wallet, 
  Calendar,
  ArrowRight,
  Target,
  History,
  Loader2,
  Coins,
  Clock
} from "lucide-react";
import { getEventosActivos, Evento } from "@/services/eventos.service";
import { saldoService } from "@/services/saldo.service";

interface DashboardData {
  gurusComprados?: number;
  aciertos?: number;
  ganancias?: number;
}

interface Prediccion {
  id: string;
  evento_id: string;
  evento_nombre: string;
  fecha: string;
  estado: "PENDIENTE" | "GANADORA" | "PERDEDORA";
  premio: number;
  cantidad_gurus: number;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [ultimasPredicciones, setUltimasPredicciones] = useState<Prediccion[]>([]);
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingEventos, setLoadingEventos] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cargar datos del dashboard
  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("No hay sesión activa");
          setLoading(false);
          return;
        }
        
        // 1. Obtener saldo
        const saldoActual = await saldoService.getSaldo();
        setSaldo(saldoActual);
        
        // 2. Obtener últimas predicciones
        try {
          const prediccionesRes = await fetch("https://api.devxsolutions.pro/predicciones/mis-predicciones", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (prediccionesRes.ok) {
            const prediccionesData = await prediccionesRes.json();
            setUltimasPredicciones(prediccionesData.slice(0, 3));
          }
        } catch (err) {
          console.error("Error cargando predicciones:", err);
        }
        
        // 3. Obtener datos del dashboard (gurús comprados, aciertos, etc)
        try {
          const res = await fetch("https://api.devxsolutions.pro/usuario/dashboard", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setDashboardData(data);
          }
        } catch (err) {
          console.error("Error cargando dashboard:", err);
        }
        
      } catch (error) {
        console.error("Error cargando dashboard:", error);
        setError(error instanceof Error ? error.message : "Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    
    cargarDashboard();
  }, []);

  // Cargar eventos activos
  useEffect(() => {
    const cargarEventos = async () => {
      try {
        setLoadingEventos(true);
        const eventosData = await getEventosActivos();
        setEventos(eventosData);
      } catch (error) {
        console.error("Error cargando eventos:", error);
      } finally {
        setLoadingEventos(false);
      }
    };
    
    cargarEventos();
  }, []);

  // Stats: 4 cards (Gurús comprados, Tasa acierto, Ganancias, Saldo)
  const stats = [
    { 
      title: "Gurús comprados", 
      value: dashboardData?.gurusComprados ?? 0, 
      icon: TrendingUp, 
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    { 
      title: "Tasa de acierto", 
      value: `${dashboardData?.aciertos ?? 0}%`, 
      icon: Target, 
      color: "text-green-600",
      bg: "bg-green-50"
    },
    { 
      title: "Ganancias totales", 
      value: `${(dashboardData?.ganancias ?? 0).toLocaleString()} créditos`, 
      icon: Coins, 
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    { 
      title: "Saldo disponible", 
      value: `${saldo.toLocaleString()} créditos`, 
      icon: Wallet, 
      color: "text-green-600",
      bg: "bg-green-50"
    },
  ];

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getEstadoColor = (estado: string) => {
    switch(estado) {
      case "GANADORA":
        return "text-green-600 bg-green-50";
      case "PERDEDORA":
        return "text-red-600 bg-red-50";
      default:
        return "text-amber-600 bg-amber-50";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch(estado) {
      case "GANADORA":
        return <TrendingUp className="w-3 h-3" />;
      case "PERDEDORA":
        return <TrendingUp className="w-3 h-3 rotate-180" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  const userName = user?.nombre || user?.email || "Usuario";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Bienvenido de vuelta,{" "}
            <span className="font-semibold text-gray-700">
              {userName}
            </span>
          </p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-green-600">
          <Link href="/eventos">
            Explorar eventos <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>

      {/* Stats Grid - 4 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bg} p-2 rounded-lg`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-400 mt-1">vs mes anterior</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Eventos Activos y Últimas Predicciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eventos Activos */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Eventos activos
              {eventos.length > 0 && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full ml-2">
                  {eventos.length} disponibles
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingEventos ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : eventos.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No hay eventos activos en este momento</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/eventos">Ver todos los eventos</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {eventos.slice(0, 3).map((evento) => (
                  <Link key={evento.id} href={`/eventos/${evento.id}`}>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer group">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                            {evento.tipo_evento === "VIP" ? "VIP" : evento.tipo_evento === "PRIVADO" ? "Privado" : "Público"}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatearFecha(evento.fecha_inicio)}
                          </span>
                        </div>
                        <p className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                          {evento.nombre}
                        </p>
                        <p className="text-sm text-green-600 font-semibold mt-1">
                          {evento.acumulado_actual.toLocaleString()} créditos
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver más <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </Link>
                ))}
                {eventos.length > 3 && (
                  <div className="text-center pt-2">
                    <Button variant="link" asChild className="text-blue-600">
                      <Link href="/eventos">
                        Ver los {eventos.length} eventos disponibles <ArrowRight className="w-4 h-4 ml-1 inline" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Últimas Predicciones */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="w-5 h-5 text-amber-600" />
              Últimas predicciones
              {ultimasPredicciones.length > 0 && (
                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full ml-2">
                  {ultimasPredicciones.length} registros
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ultimasPredicciones.length === 0 ? (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aún no has realizado predicciones</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/eventos">Comienza a predecir</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {ultimasPredicciones.map((prediccion) => (
                  <Link key={prediccion.id} href={`/eventos/${prediccion.evento_id}`}>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer group">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getEstadoColor(prediccion.estado)}`}>
                            {getEstadoIcon(prediccion.estado)}
                            <span>{prediccion.estado === "GANADORA" ? "Ganadora" : prediccion.estado === "PERDEDORA" ? "Perdedora" : "Pendiente"}</span>
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatearFecha(prediccion.fecha)}
                          </span>
                        </div>
                        <p className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                          {prediccion.evento_nombre}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-sm">
                          <span className="text-gray-500">{prediccion.cantidad_gurus} Gurú(s)</span>
                          {prediccion.premio > 0 && (
                            <span className="text-green-600 font-semibold flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              +{prediccion.premio} créditos
                            </span>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver más <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </Link>
                ))}
                {ultimasPredicciones.length >= 3 && (
                  <div className="text-center pt-2">
                    <Button variant="link" asChild className="text-blue-600">
                      <Link href="/mis-gurus">
                        Ver todas mis predicciones <ArrowRight className="w-4 h-4 ml-1 inline" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}