// app/(dashboard)/eventos/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Calendar, 
  Trophy, 
  Coins, 
  Search,
  Filter,
  Clock,
  ChevronRight,
  Loader2,
  Sparkles,
  Lock,
  Users,
  TrendingUp,
  Star,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getEventosActivos, Evento } from "@/services/eventos.service";

// Carrusel de imágenes (eventos destacados)
const carruselImages = [
  {
    id: 1,
    src: "/images/carrusel/evento-1.jpg",
    title: "Copa Libertadores 2024",
    description: "Los mejores equipos de América",
    color: "from-blue-600 to-green-600"
  },
  {
    id: 2,
    src: "/images/carrusel/evento-2.jpg",
    title: "La Liga EA Sports",
    description: "Real Madrid vs Barcelona",
    color: "from-amber-500 to-red-500"
  },
  {
    id: 3,
    src: "/images/carrusel/evento-3.jpg",
    title: "Premier League",
    description: "La liga más competitiva del mundo",
    color: "from-purple-600 to-pink-500"
  },
];

const getTipoBadge = (tipo: string) => {
  switch(tipo) {
    case "VIP":
      return (
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-md">
          <Sparkles className="w-3 h-3 mr-1" /> VIP
        </Badge>
      );
    case "PRIVADO":
      return (
        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-md">
          <Lock className="w-3 h-3 mr-1" /> Privado
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-md">
          🌍 Público
        </Badge>
      );
  }
};

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string>("todos");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        setLoading(true);
        const data = await getEventosActivos();
        setEventos(data);
      } catch (error) {
        console.error("Error cargando eventos:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarEventos();
  }, []);

  // Auto-rotate carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carruselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const eventosFiltrados = eventos.filter(e => {
    if (filter !== "todos" && e.tipo_evento !== filter) return false;
    if (searchTerm && !e.nombre.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Cargando eventos increíbles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6 rounded-3xl">
      {/* Carrusel de imágenes */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl">
        <div className="relative h-[300px] md:h-[400px] w-full">
          {carruselImages.map((img, index) => (
            <div
              key={img.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Placeholder mientras no tengas las imágenes reales */}
              <div className={`w-full h-full bg-gradient-to-r ${img.color} flex items-center justify-center`}>
                <div className="text-center text-white p-8">
                  <Trophy className="w-20 h-20 mx-auto mb-4 opacity-80" />
                  <h2 className="text-3xl md:text-5xl font-bold mb-2">{img.title}</h2>
                  <p className="text-lg opacity-90">{img.description}</p>
                  <Button className="mt-6 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0">
                    Ver eventos <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Indicadores del carrusel */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {carruselImages.map((_, index) => (
            <button
              key={index}
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 h-2 bg-white rounded-full"
                  : "w-2 h-2 bg-white/50 rounded-full hover:bg-white/75"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
        
        {/* Flechas de navegación */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + carruselImages.length) % carruselImages.length)}
        >
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % carruselImages.length)}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Header con estadísticas */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            Eventos Activos
          </h1>
          <p className="text-gray-500 mt-2">
            Descubre los eventos disponibles y comienza a ganar créditos
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
            <p className="text-xs text-gray-400">Eventos disponibles</p>
            <p className="text-2xl font-bold text-green-600">{eventosFiltrados.length}</p>
          </div>
          <div className="bg-white rounded-xl px-4 py-2 shadow-sm">
            <p className="text-xs text-gray-400">Premio total</p>
            <p className="text-2xl font-bold text-amber-600">
              {eventosFiltrados.reduce((sum, e) => sum + e.acumulado_actual, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filter === "todos" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("todos")}
            className={filter === "todos" ? "bg-gradient-to-r from-blue-600 to-green-600 shadow-md" : ""}
          >
            Todos
          </Button>
          <Button 
            variant={filter === "PUBLICO" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("PUBLICO")}
            className={filter === "PUBLICO" ? "bg-gradient-to-r from-green-500 to-emerald-500" : ""}
          >
            🌍 Públicos
          </Button>
          <Button 
            variant={filter === "VIP" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("VIP")}
            className={filter === "VIP" ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            VIP
          </Button>
          <Button 
            variant={filter === "PRIVADO" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("PRIVADO")}
            className={filter === "PRIVADO" ? "bg-gradient-to-r from-amber-500 to-orange-500" : ""}
          >
            <Lock className="w-3 h-3 mr-1" />
            Privados
          </Button>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar evento..."
            className="pl-9 border-gray-200 focus:border-blue-300 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid de eventos */}
      {eventosFiltrados.length === 0 ? (
        <Card className="border-0 shadow-xl rounded-2xl">
          <CardContent className="py-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-12 h-12 text-gray-300" />
            </div>
            <p className="text-gray-500 text-lg">No hay eventos disponibles</p>
            <p className="text-sm text-gray-400 mt-1">Vuelve pronto para nuevos eventos</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventosFiltrados.map((evento, index) => (
            <Card 
              key={evento.id} 
              className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-2xl overflow-hidden"
            >
              {/* Banner de gradiente */}
              <div className={`h-2 w-full bg-gradient-to-r ${
                evento.tipo_evento === "VIP" 
                  ? "from-purple-500 to-pink-500" 
                  : evento.tipo_evento === "PRIVADO" 
                  ? "from-amber-500 to-orange-500" 
                  : "from-green-500 to-blue-500"
              }`} />
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                      {evento.nombre}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      <div className="flex items-center gap-1 text-xs">
                        <Clock className="w-3 h-3" />
                        {new Date(evento.fecha_inicio).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </CardDescription>
                  </div>
                  {getTipoBadge(evento.tipo_evento)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Premio acumulado
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    {evento.acumulado_actual.toLocaleString()} créditos
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Límite por Gurú
                  </span>
                  <span className="font-semibold">{evento.limite_prediccion.toLocaleString()} créditos</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    Comisión casa
                  </span>
                  <span className="font-semibold">{evento.porcentaje_casa}%</span>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-md hover:shadow-xl transition-all duration-300 rounded-xl py-6" 
                  asChild
                >
                  <Link href={`/eventos/${evento.id}`}>
                    Ver detalles 
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}