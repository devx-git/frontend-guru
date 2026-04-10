"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getEventosActivos, Evento } from "@/services/eventos.service";

const getTipoBadge = (tipo: string) => {
  switch(tipo) {
    case "VIP":
      return <Badge className="bg-purple-100 text-purple-700 border-purple-200"><Sparkles className="w-3 h-3 mr-1" />VIP</Badge>;
    case "PRIVADO":
      return <Badge className="bg-amber-100 text-amber-700 border-amber-200"><Lock className="w-3 h-3 mr-1" />Privado</Badge>;
    default:
      return <Badge className="bg-green-100 text-green-700 border-green-200">Público</Badge>;
  }
};

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string>("todos");

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

  const eventosFiltrados = eventos.filter(e => {
    if (filter !== "todos" && e.tipo_evento !== filter) return false;
    if (searchTerm && !e.nombre.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
        <p className="text-gray-500 mt-1">
          Explora los eventos disponibles y compra tus Gurús
        </p>
      </div>

      {/* Búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filter === "todos" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("todos")}
            className={filter === "todos" ? "bg-gradient-to-r from-blue-600 to-green-600" : ""}
          >
            Todos
          </Button>
          <Button 
            variant={filter === "PUBLICO" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("PUBLICO")}
          >
            Públicos
          </Button>
          <Button 
            variant={filter === "VIP" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("VIP")}
          >
            VIP
          </Button>
          <Button 
            variant={filter === "PRIVADO" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("PRIVADO")}
          >
            Privados
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

      {/* Lista de eventos */}
      {eventosFiltrados.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay eventos disponibles</p>
            <p className="text-sm text-gray-400 mt-1">Vuelve pronto para nuevos eventos</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventosFiltrados.map((evento) => (
            <Card key={evento.id} className="border-0 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{evento.nombre}</CardTitle>
                  {getTipoBadge(evento.tipo_evento)}
                </div>
                <CardDescription>
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
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Acumulado:</span>
                  <span className="text-xl font-bold text-green-600">
                    {evento.acumulado_actual.toLocaleString()} créditos
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-gray-500">Límite por predicción:</span>
                  <span className="font-medium">{evento.limite_prediccion.toLocaleString()} créditos</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600" asChild>
                  <Link href={`/eventos/${evento.id}`}>
                    Ver detalles <ChevronRight className="w-4 h-4 ml-2" />
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