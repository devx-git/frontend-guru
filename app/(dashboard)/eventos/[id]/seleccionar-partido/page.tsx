"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Trophy, 
  Clock, 
  Coins, 
  Loader2,
  ChevronRight,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getEventoDetalle, Evento } from "@/services/eventos.service";
import { saldoService } from "@/services/saldo.service";
import { useAuthStore } from "@/store/auth.store";

interface Partido {
  id: string;
  equipo_local: string;
  equipo_visitante: string;
  fecha: string;
  estado: string;
}

export default function SeleccionarPartidoPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [saldo, setSaldo] = useState(0);
  const [partidoSeleccionado, setPartidoSeleccionado] = useState<Partido | null>(null);
  const [cantidadGurus, setCantidadGurus] = useState(1);

  const eventoId = params.id as string;
  const COSTO_POR_GURU = 2;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [eventoData, saldoActual] = await Promise.all([
          getEventoDetalle(eventoId),
          saldoService.getSaldo()
        ]);
        
        setEvento(eventoData);
        setPartidos(eventoData.partidos || []);
        setSaldo(saldoActual);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, [eventoId]);

  const totalCreditos = cantidadGurus * COSTO_POR_GURU;
  const totalPredicciones = cantidadGurus * 10;

  const handleSeleccionarPartido = (partido: Partido) => {
    setPartidoSeleccionado(partido);
  };

  const handleContinuar = () => {
    if (!partidoSeleccionado) return;
    
    router.push(
      `/eventos/${eventoId}/prediccion?partidoId=${partidoSeleccionado.id}&cantidad=${cantidadGurus}`
    );
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8">
      {/* Header */}
      <Button
        variant="ghost"
        className="-ml-2 text-gray-600"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al evento
      </Button>

      {/* Info del evento */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">{evento?.nombre}</h1>
        <div className="flex items-center gap-2 text-white/80">
          <Coins className="w-4 h-4" />
          <span>Saldo disponible: {saldo.toLocaleString()} créditos</span>
        </div>
      </div>

      {/* Selección de partido */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Selecciona un partido
        </h2>
        
        <div className="grid gap-4">
          {partidos.map((partido) => (
            <Card 
              key={partido.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                partidoSeleccionado?.id === partido.id 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200'
              }`}
              onClick={() => handleSeleccionarPartido(partido)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 text-center">
                    <p className="text-lg font-bold">{partido.equipo_local}</p>
                  </div>
                  <div className="px-4">
                    <span className="text-sm font-bold text-gray-400">VS</span>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-lg font-bold">{partido.equipo_visitante}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {formatearFecha(partido.fecha)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Selección de cantidad de Gurús */}
      {partidoSeleccionado && (
        <Card className="border-0 shadow-lg mt-6">
          <CardHeader>
            <CardTitle className="text-xl">¿Cuántos Gurús quieres comprar?</CardTitle>
            <CardDescription>
              Cada Gurú incluye 10 predicciones para este partido
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                className="w-12 h-12 rounded-full"
                onClick={() => setCantidadGurus(Math.max(1, cantidadGurus - 1))}
                disabled={cantidadGurus === 1}
              >
                -
              </Button>
              <div className="text-center">
                <span className="text-3xl font-bold text-blue-600">{cantidadGurus}</span>
                <p className="text-gray-500">Gurús</p>
              </div>
              <Button
                variant="outline"
                size="lg"
                className="w-12 h-12 rounded-full"
                onClick={() => setCantidadGurus(Math.min(10, cantidadGurus + 1))}
                disabled={cantidadGurus === 10}
              >
                +
              </Button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span>Costo total:</span>
                <span className="font-bold text-green-600">{totalCreditos} créditos</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Predicciones incluidas:</span>
                <span>{totalPredicciones} predicciones</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 py-6"
              onClick={handleContinuar}
              disabled={!partidoSeleccionado}
            >
              Continuar con las predicciones
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}