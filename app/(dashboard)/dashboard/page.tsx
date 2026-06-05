// D:\Guru\guru-frontend\app\(dashboard)\page.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  TrendingUp, 
  Calendar, 
  ArrowRight,
  Target,
  Wallet,
  History,
  Loader2,
  Coins,
  Clock,
  Trophy,
  Flame,
  Star,
  Zap,
  Users
} from "lucide-react";
import { getEventosActivos, Evento } from "@/services/eventos.service";
import { saldoService } from "@/services/saldo.service";

// Types
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
  const [error, setError] = useState<string | null>(null);
  
  const isMounted = useRef(true);
  const abortControllers = useRef<AbortController[]>([]);

  const abortAllFetches = useCallback(() => {
    abortControllers.current.forEach(controller => {
      try {
        controller.abort();
      } catch (e) {}
    });
    abortControllers.current = [];
  }, []);

  const cargarDashboard = useCallback(async () => {
    const controller = new AbortController();
    abortControllers.current.push(controller);
    
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      
      if (!token) {
        if (isMounted.current) setError("No hay sesión activa");
        return;
      }
      
      const [saldoActual, dashboardRes, prediccionesRes] = await Promise.allSettled([
        saldoService.getSaldo(),
        fetch("https://api.devxsolutions.pro/usuario/dashboard", {
          headers: { "Authorization": `Bearer ${token}` },
          signal: controller.signal
        }),
        fetch("https://api.devxsolutions.pro/predicciones/mis-predicciones", {
          headers: { "Authorization": `Bearer ${token}` },
          signal: controller.signal
        })
      ]);
      
      if (!isMounted.current) return;
      
      if (saldoActual.status === 'fulfilled') {
        setSaldo(saldoActual.value);
      }
      
      if (dashboardRes.status === 'fulfilled' && dashboardRes.value.ok) {
        const data = await dashboardRes.value.json();
        setDashboardData(data);
      }
      
      if (prediccionesRes.status === 'fulfilled' && prediccionesRes.value.ok) {
        const data = await prediccionesRes.value.json();
        setUltimasPredicciones(data.slice(0, 3));
      }
      
    } catch (error: any) {
      if (error.name !== 'AbortError' && isMounted.current) {
        console.error("Error cargando dashboard:", error);
        setError(error instanceof Error ? error.message : "Error al cargar los datos");
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  const cargarEventos = useCallback(async () => {
    const controller = new AbortController();
    abortControllers.current.push(controller);
    
    try {
      const eventosData = await getEventosActivos();
      if (isMounted.current) {
        setEventos(eventosData || []);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Error cargando eventos:", error);
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    cargarDashboard();
    cargarEventos();
    
    return () => {
      isMounted.current = false;
      abortAllFetches();
      setDashboardData(null);
      setEventos([]);
      setUltimasPredicciones([]);
    };
  }, [cargarDashboard, cargarEventos, abortAllFetches]);

  // Stats mejorados con gradientes y efectos
  const stats = [
    { 
      title: "Gurús comprados", 
      value: dashboardData?.gurusComprados ?? 0, 
      icon: TrendingUp, 
      color: "text-blue-600",
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      border: "border-blue-200",
      gradient: "from-blue-600 to-blue-400"
    },
    { 
      title: "Tasa de acierto", 
      value: `${dashboardData?.aciertos ?? 0}%`, 
      icon: Target, 
      color: "text-green-600",
      bg: "bg-gradient-to-br from-green-50 to-green-100",
      border: "border-green-200",
      gradient: "from-green-600 to-green-400"
    },
    { 
      title: "Ganancias totales", 
      value: `${(dashboardData?.ganancias ?? 0).toLocaleString()} créditos`, 
      icon: Trophy, 
      color: "text-amber-600",
      bg: "bg-gradient-to-br from-amber-50 to-amber-100",
      border: "border-amber-200",
      gradient: "from-amber-600 to-amber-400"
    },
    { 
      title: "Saldo disponible", 
      value: `${saldo.toLocaleString()} créditos`, 
      icon: Wallet, 
      color: "text-emerald-600",
      bg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      border: "border-emerald-200",
      gradient: "from-emerald-600 to-emerald-400"
    },
  ];

  const formatearFecha = (fecha: string) => {
    try {
      return new Date(fecha).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return fecha;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch(estado) {
      case "GANADORA": return "text-green-600 bg-green-100 border-green-200";
      case "PERDEDORA": return "text-red-600 bg-red-100 border-red-200";
      default: return "text-amber-600 bg-amber-100 border-amber-200";
    }
  };

  const getEstadoIcono = (estado: string) => {
    switch(estado) {
      case "GANADORA": return <Trophy className="w-3 h-3" />;
      case "PERDEDORA": return <Zap className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getTipoEventoColor = (tipo: string) => {
    switch(tipo) {
      case "VIP": return "bg-gradient-to-r from-purple-500 to-purple-600 text-white";
      case "PRIVADO": return "bg-gradient-to-r from-amber-500 to-amber-600 text-white";
      default: return "bg-gradient-to-r from-green-500 to-green-600 text-white";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center max-w-md shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setError(null);
              cargarDashboard();
            }}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  const userName = user?.nombre || user?.email || "Usuario";

  return (
    <div className="space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6 rounded-3xl">
      {/* Header con gradiente */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-2">
            Bienvenido de vuelta,{" "}
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              {userName}
            </span>
          </p>
        </div>
        <Button 
          asChild 
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
        >
          <Link href="/eventos">
            Explorar eventos <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>

      {/* Stats Grid con diseño moderno */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.title} 
              className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl overflow-hidden ${stat.bg}`}
            >
              <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                <Icon className="w-20 h-20" />
              </div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 rounded-xl bg-white shadow-md ${stat.color}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  últimos 30 días
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Eventos Activos y Últimas Predicciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eventos Activos */}
        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-green-500" />
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-800">Eventos activos</span>
              {eventos.length > 0 && (
                <span className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs px-2.5 py-1 rounded-full ml-2 shadow-md">
                  {eventos.length} disponibles
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {eventos.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-gray-300" />
                </div>
                <p className="text-gray-500">No hay eventos activos en este momento</p>
                <Button variant="outline" className="mt-6 rounded-xl" asChild>
                  <Link href="/eventos">Ver todos los eventos</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {eventos.slice(0, 3).map((evento, index) => (
                  <Link key={evento.id} href={`/eventos/${evento.id}`}>
                    <div className="group relative bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-green-500/5 transition-all duration-300" />
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium shadow-sm ${getTipoEventoColor(evento.tipo_evento)}`}>
                              {evento.tipo_evento === "VIP" ? "👑 VIP" : evento.tipo_evento === "PRIVADO" ? "🔒 Privado" : "🌍 Público"}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatearFecha(evento.fecha_inicio)}
                            </span>
                          </div>
                          <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                            {evento.nombre}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                              <Coins className="w-3.5 h-3.5 text-amber-500" />
                              <p className="text-sm font-bold text-green-600">
                                {(evento.acumulado_actual?.toLocaleString() || 0).toLocaleString()} créditos
                              </p>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl"
                        >
                          Ver más <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Últimas Predicciones */}
        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-orange-500" />
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
                <History className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-800">Últimas predicciones</span>
              {ultimasPredicciones.length > 0 && (
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2.5 py-1 rounded-full ml-2 shadow-md">
                  {ultimasPredicciones.length} registros
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {ultimasPredicciones.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-10 h-10 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">Aún no has realizado predicciones</p>
                <p className="text-gray-400 text-sm mt-1">¡Comienza a predecir y gana grandes premios!</p>
                <Button className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700" asChild>
                  <Link href="/eventos">
                    Comienza a predecir <Star className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {ultimasPredicciones.map((prediccion) => (
                  <Link key={prediccion.id} href={`/eventos/${prediccion.evento_id}`}>
                    <div className="group relative bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/5 group-hover:to-orange-500/5 transition-all duration-300" />
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 border ${getEstadoColor(prediccion.estado)}`}>
                              {getEstadoIcono(prediccion.estado)}
                              <span className="ml-1">
                                {prediccion.estado === "GANADORA" ? "¡Ganadora!" : prediccion.estado === "PERDEDORA" ? "Perdedora" : "En juego"}
                              </span>
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatearFecha(prediccion.fecha)}
                            </span>
                          </div>
                          <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                            {prediccion.evento_nombre}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-sm">
                            <span className="text-gray-500 flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {prediccion.cantidad_gurus} Gurú(s)
                            </span>
                            {prediccion.premio > 0 && (
                              <span className="text-green-600 font-bold flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                                <Trophy className="w-3 h-3" />
                                +{prediccion.premio.toLocaleString()} créditos
                              </span>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl"
                        >
                          Ver más <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}