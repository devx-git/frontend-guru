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
  Flame
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
      <div className="min-h-[60vh] flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <Flame className="w-8 h-8 text-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-400">Cargando información...</p>
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

      <div className="relative z-10 max-w-4xl mx-auto space-y-6 py-8 px-4">
        
        {/* Botón volver */}
        <Button
          variant="ghost"
          className="-ml-2 text-gray-400 hover:text-green-400 transition-colors rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al evento
        </Button>

        {/* Info del evento */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">{evento?.nombre}</h1>
            <div className="flex items-center gap-2 text-white/80">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <Coins className="w-3 h-3" />
              </div>
              <span>Saldo disponible: <span className="font-bold">{saldo.toLocaleString()} créditos</span></span>
            </div>
          </div>
        </div>

        {/* Selección de partido */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            Selecciona un partido
          </h2>
          
          <div className="grid gap-4">
            {partidos.map((partido) => (
              <Card 
                key={partido.id}
                className={`cursor-pointer transition-all duration-300 ${
                  partidoSeleccionado?.id === partido.id 
                    ? 'border-green-500 bg-green-500/10 shadow-lg' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                } rounded-2xl`}
                onClick={() => handleSeleccionarPartido(partido)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-center">
                      <p className="text-lg font-bold text-white">{partido.equipo_local}</p>
                    </div>
                    <div className="px-4">
                      <span className="text-sm font-bold text-gray-500 bg-white/10 px-3 py-1 rounded-full">VS</span>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="text-lg font-bold text-white">{partido.equipo_visitante}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-400">
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
          <Card className="relative overflow-hidden bg-black/80 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl mt-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-full blur-2xl" />
            
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                ¿Cuántos Gurús quieres comprar?
              </CardTitle>
              <CardDescription className="text-gray-400">
                Cada Gurú incluye 10 predicciones para este partido
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-12 h-12 rounded-full border-white/20 text-white hover:bg-white/10 hover:border-green-500"
                  onClick={() => setCantidadGurus(Math.max(1, cantidadGurus - 1))}
                  disabled={cantidadGurus === 1}
                >
                  -
                </Button>
                <div className="text-center">
                  <span className="text-3xl font-bold text-green-400">{cantidadGurus}</span>
                  <p className="text-gray-400">Gurús</p>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-12 h-12 rounded-full border-white/20 text-white hover:bg-white/10 hover:border-green-500"
                  onClick={() => setCantidadGurus(Math.min(10, cantidadGurus + 1))}
                  disabled={cantidadGurus === 10}
                >
                  +
                </Button>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 space-y-2 border border-white/10">
                <div className="flex justify-between">
                  <span className="text-gray-400">Costo total:</span>
                  <span className="font-bold text-green-400">{totalCreditos} créditos</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Predicciones incluidas:</span>
                  <span className="text-gray-300">{totalPredicciones} predicciones</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
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
    </div>
  );
}