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
  Search
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
      return <Badge className="bg-green-100 text-green-700 border-green-200">Ganadora 🎉</Badge>;
    case "PERDEDORA":
      return <Badge className="bg-red-100 text-red-700 border-red-200">Perdedora</Badge>;
    case "PENDIENTE":
      return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Pendiente ⏳</Badge>;
    case "PARCIAL":
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Parcial 🎯</Badge>;
    default:
      return <Badge variant="outline">{estado}</Badge>;
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
        // const token = localStorage.getItem("token");
        // const res = await fetch("https://api.devxsolutions.pro/usuario/predicciones", {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // const data = await res.json();
        // setPredicciones(data);
        
        // Usar datos mock por ahora
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Gurús</h1>
          <p className="text-gray-500 mt-1">
            Historial de tus predicciones y resultados
          </p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-green-600">
          <Link href="/eventos">
            Explorar eventos <ChevronRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-gray-500">Total Gurús</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{stats.pendientes}</p>
            <p className="text-xs text-gray-500">Pendientes</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.ganadoras}</p>
            <p className="text-xs text-gray-500">Ganadoras</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.perdidas}</p>
            <p className="text-xs text-gray-500">Perdidas</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.ganancias.toLocaleString()} créditos</p>
            <p className="text-xs text-gray-500">Ganancias totales</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Button 
            variant={filter === "todos" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("todos")}
            className={filter === "todos" ? "bg-gradient-to-r from-blue-600 to-green-600" : ""}
          >
            Todos
          </Button>
          <Button 
            variant={filter === "pendiente" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("pendiente")}
            className={filter === "pendiente" ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            Pendientes
          </Button>
          <Button 
            variant={filter === "ganadora" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("ganadora")}
            className={filter === "ganadora" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            Ganadoras
          </Button>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar evento..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de predicciones */}
      {prediccionesFiltradas.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No tienes predicciones registradas</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/eventos">Comienza a predecir</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {prediccionesFiltradas.map((prediccion) => (
            <Card key={prediccion.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getEstadoBadge(prediccion.estado)}
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(prediccion.fecha).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800">{prediccion.evento_nombre}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-gray-500">{prediccion.cantidad_gurus} Gurú(s)</span>
                      {prediccion.premio && prediccion.premio > 0 && (
                        <span className="text-green-600 font-semibold flex items-center gap-1">
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
                    className="shrink-0"
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
  );
}