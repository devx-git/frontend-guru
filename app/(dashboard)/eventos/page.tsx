// app/(dashboard)/eventos/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// Eliminado: Image (no se usa)
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
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getEventosActivos, Evento } from "@/services/eventos.service";

// Carrusel de imágenes (eventos destacados) - RUTAS CORREGIDAS
const carruselImages = [
  {
    id: 1,
    src: "/images/carrusel/evento-1.png",  // ← Corregido
    title: "Fifa World Cup",
    description: "Los mejores equipos del mundo 2026",
    color: "from-blue-600 to-green-600"
  },
  {
    id: 2,
    src: "/images/carrusel/evento-2.png",  // ← Corregido
    title: "La Liga EA Sports",
    description: "Real Madrid vs Barcelona",
    color: "from-amber-500 to-red-500"
  },
  {
    id: 3,
    src: "/images/carrusel/evento-3.png",  // ← Corregido
    title: "conmebol ",
    description: "Libertadores",
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
      {/* Carrusel de imágenes - CORREGIDO */}
      
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
              {/* Imagen de fondo */}
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  console.error(`Error cargando imagen: ${img.src}`);
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* Overlay oscuro para que la imagen se vea más limpia */}
              <div className="absolute inset-0 bg-black/40" />
              
              {/* Contenido con texto casi transparente */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                <Trophy className="w-12 h-12 md:w-16 md:h-16 mb-2 opacity-15" />
                <h2 className="text-xl md:text-3xl font-bold mb-1 opacity-10">
                  {img.title}
                </h2>
                <p className="text-sm md:text-base opacity-8">
                  {img.description}
                </p>
                <Button 
                  className="mt-3 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white/30 border-0 rounded-xl text-sm md:text-base px-4 py-1 transition-all"
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
      
      {/* Indicadores del carrusel */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-20">
        {carruselImages.map((_, idx) => (
          <button
            key={idx}
            className={`transition-all duration-300 ${
              idx === currentSlide
                ? "w-6 h-1.5 bg-white/50 rounded-full"
                : "w-1.5 h-1.5 bg-white/30 rounded-full hover:bg-white/50"
            }`}
            onClick={() => setCurrentSlide(idx)}
          />
        ))}
      </div>
      
      {/* Flechas de navegación */}
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white/50 rounded-full p-1.5 transition-all z-20"
        onClick={() => setCurrentSlide((prev) => (prev - 1 + carruselImages.length) % carruselImages.length)}
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
      </button>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white/50 rounded-full p-1.5 transition-all z-20"
        onClick={() => setCurrentSlide((prev) => (prev + 1) % carruselImages.length)}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>

      {/* Resto del código igual... Header, Filtros, Grid de eventos */}
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
          {eventosFiltrados.map((evento) => (
            <Card 
              key={evento.id} 
              className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-2xl overflow-hidden"
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