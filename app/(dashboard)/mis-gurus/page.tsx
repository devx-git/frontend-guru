"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Trophy, 
  Calendar, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Eye,
  ChevronRight,
  Loader2,
  AlertCircle,
  Filter,
  Search,
  Flame,
  Coins
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth.store";

interface Prediccion {
  id: string;
  evento_id: string;
  evento_nombre: string;
  fecha: string;
  estado: "GANADORA" | "PERDEDORA" | "PENDIENTE" | "PARCIAL";
  premio?: number;
  cantidad_gurus: number;
}

// Datos mock para desarrollo (esto vendrá del backend)
const mockPredicciones: Prediccion[] = [
  {
    id: "1",
    evento_id: "evento-1",
    evento_nombre: "Mundial 2026 - Brasil vs Argentina",
    fecha: "2026-03-20T15:00:00",
    estado: "PENDIENTE",
    cantidad_gurus: 2,
    premio: 0
  },
  {
    id: "2",
    evento_id: "evento-2",
    evento_nombre: "Champions League - Final",
    fecha: "2026-03-25T20:00:00",
    estado: "PENDIENTE",
    cantidad_gurus: 1,
    premio: 0
  },
  {
    id: "3",
    evento_id: "evento-3",
    evento_nombre: "LaLiga - El Clásico",
    fecha: "2026-03-28T16:00:00",
    estado: "GANADORA",
    cantidad_gurus: 3,
    premio: 450
  },
  {
    id: "4",
    evento_id: "evento-4",
    evento_nombre: "Premier League - Manchester Derby",
    fecha: "2026-03-15T13:30:00",
    estado: "PERDEDORA",
    cantidad_gurus: 1,
    premio: 0
  }
];

const getEstadoBadge = (estado: string) => {
  switch(estado) {
    case "GANADORA":
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 rounded-full">Ganadora 🎉</Badge>;
    case "PERDEDORA":
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 rounded-full">Perdedora</Badge>;
    case "PENDIENTE":
      return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 rounded-full">Pendiente ⏳</Badge>;
    case "PARCIAL":
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 rounded-full">Parcial 🎯</Badge>;
    default:
      return <Badge variant="outline" className="border-white/20 text-gray-400">{estado}</Badge>;
  }
};

export default function MisGurusPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [predicciones, setPredicciones] = useState<Prediccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const cargarPredicciones = async () => {
      try {
        setLoading(true);
        // TODO: Conectar con backend
        setTimeout(() => {
          setPredicciones(mockPredicciones);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error cargando predicciones:", error);
        setLoading(false);
      }
    };
    
    cargarPredicciones();
  }, []);

  const prediccionesFiltradas = predicciones.filter(p => {
    if (filter !== "todos" && p.estado !== filter.toUpperCase()) return false;
    if (searchTerm && !p.evento_nombre.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: predicciones.length,
    pendientes: predicciones.filter(p => p.estado === "PENDIENTE").length,
    ganadoras: predicciones.filter(p => p.estado === "GANADORA").length,
    perdidas: predicciones.filter(p => p.estado === "PERDEDORA").length,
    ganancias: predicciones.reduce((sum, p) => sum + (p.premio || 0), 0)
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <Flame className="w-8 h-8 text-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-400">Cargando tus Gurús...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Fondo lobby */}
      <div className="fixed inset-0 w-full h-full bg-[url('/img/lobby.jpg')] bg-cover bg-center opacity-30 z-[-2]" />
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90 z-[-1]" />
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[linear-gradient(rgba(141,198,63,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(141,198,63,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6 p-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-green-500 to-emerald-500 bg-clip-text text-transparent">
              Mis Gurús
            </h1>
            <p className="text-gray-400 mt-1">
              Historial de tus predicciones y resultados
            </p>
          </div>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
            <Link href="/eventos">
              Explorar eventos <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 rounded-xl">
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-gray-400">Total Gurús</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 rounded-xl">
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-amber-400">{stats.pendientes}</p>
              <p className="text-xs text-gray-400">Pendientes</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 rounded-xl">
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-green-400">{stats.ganadoras}</p>
              <p className="text-xs text-gray-400">Ganadoras</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 rounded-xl">
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-red-400">{stats.perdidas}</p>
              <p className="text-xs text-gray-400">Perdidas</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-xl">
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-green-400">{stats.ganancias.toLocaleString()} créditos</p>
              <p className="text-xs text-gray-400">Ganancias totales</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={filter === "todos" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("todos")}
              className={filter === "todos" ? "bg-gradient-to-r from-blue-600 to-green-600 shadow-md rounded-full" : "rounded-full border-white/20 text-white hover:bg-white/10"}
            >
              Todos
            </Button>
            <Button 
              variant={filter === "pendiente" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("pendiente")}
              className={filter === "pendiente" ? "bg-amber-500 hover:bg-amber-600 rounded-full" : "rounded-full border-white/20 text-white hover:bg-white/10"}
            >
              Pendientes
            </Button>
            <Button 
              variant={filter === "ganadora" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("ganadora")}
              className={filter === "ganadora" ? "bg-green-500 hover:bg-green-600 rounded-full" : "rounded-full border-white/20 text-white hover:bg-white/10"}
            >
              Ganadoras
            </Button>
            <Button 
              variant={filter === "perdedora" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("perdedora")}
              className={filter === "perdedora" ? "bg-red-500 hover:bg-red-600 rounded-full" : "rounded-full border-white/20 text-white hover:bg-white/10"}
            >
              Perdedoras
            </Button>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Buscar evento..."
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500/20 rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Lista de predicciones */}
        {prediccionesFiltradas.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 rounded-2xl">
            <CardContent className="py-12 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-gray-600" />
              </div>
              <p className="text-gray-400">No tienes predicciones registradas</p>
              <Button variant="outline" className="mt-4 rounded-full border-white/20 text-white hover:bg-white/10" asChild>
                <Link href="/eventos">Comienza a predecir</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {prediccionesFiltradas.map((prediccion) => (
              <Card key={prediccion.id} className="bg-white/5 backdrop-blur-sm border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {getEstadoBadge(prediccion.estado)}
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(prediccion.fecha).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                      <h3 className="font-semibold text-white">{prediccion.evento_nombre}</h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Coins className="w-3 h-3" />
                          {prediccion.cantidad_gurus} Gurú(s)
                        </span>
                        {prediccion.premio && prediccion.premio > 0 && (
                          <span className="text-green-400 font-semibold flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +{prediccion.premio} créditos
                          </span>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                      className="shrink-0 rounded-full border-white/20 text-white hover:bg-white/10 hover:border-green-500"
                    >
                      <Link href={`/eventos/${prediccion.evento_id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver detalles
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}