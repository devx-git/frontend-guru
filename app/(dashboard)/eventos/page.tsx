// app/(dashboard)/eventos/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Trophy, 
  Search,
  Clock,
  ChevronRight,
  Loader2,
  Sparkles,
  Lock,
  Users,
  Zap,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getEventosActivos, Evento } from "@/services/eventos.service";

// Carrusel de imágenes
const carruselImages = [
  {
    id: 1,
    src: "/images/carrusel/evento-1.png",
    title: "Fifa World Cup",
    description: "Los mejores equipos del mundo 2026",
    color: "from-blue-600 to-green-600"
  },
  {
    id: 2,
    src: "/images/carrusel/evento-2.png",
    title: "La Liga EA Sports",
    description: "Real Madrid vs Barcelona",
    color: "from-amber-500 to-red-500"
  },
  {
    id: 3,
    src: "/images/carrusel/evento-3.png",
    title: "CONMEBOL Libertadores",
    description: "La gloria eterna",
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
      <div className="min-h-[60vh] flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <Flame className="w-8 h-8 text-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-400">Cargando eventos increíbles...</p>
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

      <div className="relative z-10 max-w-7xl mx-auto space-y-8 p-6">
        
        {/* Carrusel */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <div className="relative h-[180px] md:h-[260px] w-full">
            {carruselImages.map((img, idx) => (
              <div
                key={img.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <div className={`relative w-full h-full bg-gradient-to-r ${img.color}`}>
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      console.error(`Error cargando imagen: ${img.src}`);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                    <Trophy className="w-12 h-12 md:w-16 md:h-16 mb-2 opacity-40" />
                    <h2 className="text-xl md:text-3xl font-bold mb-1 opacity-80">{img.title}</h2>
                    <p className="text-sm md:text-base opacity-70">{img.description}</p>
                    <Button 
                      className="mt-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-0 rounded-full text-sm md:text-base px-4 py-1 transition-all"
                      onClick={() => {
                        const eventosSection = document.getElementById('eventos-section');
                        if (eventosSection) {
                          eventosSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      Ver eventos <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Indicadores */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-20">
            {carruselImages.map((_, idx) => (
              <button
                key={idx}
                className={`transition-all duration-300 ${
                  idx === currentSlide
                    ? "w-6 h-1.5 bg-green-500 rounded-full"
                    : "w-1.5 h-1.5 bg-white/30 rounded-full hover:bg-white/50"
                }`}
                onClick={() => setCurrentSlide(idx)}
              />
            ))}
          </div>
          
          {/* Flechas */}
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition-all z-20"
            onClick={() => setCurrentSlide((prev) => (prev - 1 + carruselImages.length) % carruselImages.length)}
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition-all z-20"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % carruselImages.length)}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-green-500 to-emerald-500 bg-clip-text text-transparent">
              Eventos Activos
            </h1>
            <p className="text-gray-400 mt-2">
              Descubre los eventos disponibles y comienza a ganar créditos
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <p className="text-xs text-gray-400">Eventos disponibles</p>
              <p className="text-2xl font-bold text-green-400">{eventosFiltrados.length}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <p className="text-xs text-gray-400">Premio total</p>
              <p className="text-2xl font-bold text-amber-400">
                {eventosFiltrados.reduce((sum, e) => sum + e.acumulado_actual, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
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
              variant={filter === "PUBLICO" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("PUBLICO")}
              className={filter === "PUBLICO" ? "bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" : "rounded-full border-white/20 text-white hover:bg-white/10"}
            >
              🌍 Públicos
            </Button>
            <Button 
              variant={filter === "VIP" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("VIP")}
              className={filter === "VIP" ? "bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" : "rounded-full border-white/20 text-white hover:bg-white/10"}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              VIP
            </Button>
            <Button 
              variant={filter === "PRIVADO" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("PRIVADO")}
              className={filter === "PRIVADO" ? "bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" : "rounded-full border-white/20 text-white hover:bg-white/10"}
            >
              <Lock className="w-3 h-3 mr-1" />
              Privados
            </Button>
          </div>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Buscar evento..."
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500/20 rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grid de eventos */}
        {eventosFiltrados.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 rounded-2xl">
            <CardContent className="py-16 text-center">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-12 h-12 text-gray-600" />
              </div>
              <p className="text-gray-400 text-lg">No hay eventos disponibles</p>
              <p className="text-sm text-gray-500 mt-1">Vuelve pronto para nuevos eventos</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventosFiltrados.map((evento) => (
              <Card 
                key={evento.id} 
                className="group bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 rounded-2xl overflow-hidden"
              >
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
                      <CardTitle className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
                        {evento.nombre}
                      </CardTitle>
                      <CardDescription className="mt-1 text-gray-400">
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
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      Premio acumulado
                    </span>
                    <span className="text-xl font-bold text-green-400">
                      {evento.acumulado_actual.toLocaleString()} créditos
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Límite por Gurú
                    </span>
                    <span className="font-semibold text-white">{evento.limite_prediccion.toLocaleString()} créditos</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      Comisión casa
                    </span>
                    <span className="font-semibold text-white">{evento.porcentaje_casa}%</span>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-md hover:shadow-xl transition-all duration-300 rounded-full py-5" 
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
    </div>
  );
}