"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trophy, 
  Clock,
  Coins,
  AlertCircle,
  Loader2,
  ChevronRight,
  Zap,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getEventoDetalle, Evento } from "@/services/eventos.service";
import { useAuthStore } from "@/store/auth.store";
import { saldoService } from "@/services/saldo.service";

export default function SeleccionarGurusPage() {
  const params = useParams();
  const router = useRouter();
  const { token, user } = useAuthStore();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [cantidadGurus, setCantidadGurus] = useState(1);
  const [saldoUsuario, setSaldoUsuario] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const eventoId = params.id as string;
  const COSTO_POR_GURU = 2;
  const TOTAL_PREDICCIONES = 10;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const eventoData = await getEventoDetalle(eventoId);
        setEvento(eventoData);
        
        const saldo = await saldoService.getSaldo();
        setSaldoUsuario(saldo);
        
      } catch (err) {
        console.error("Error cargando evento:", err);
        setError("No se pudo cargar la información del evento");
      } finally {
        setLoading(false);
      }
    };
    
    if (eventoId) {
      cargarDatos();
    }
  }, [eventoId]);

  const totalCreditos = cantidadGurus * COSTO_POR_GURU;
  const totalPredicciones = cantidadGurus * TOTAL_PREDICCIONES;

  const handleAumentar = () => {
    setCantidadGurus(prev => Math.min(prev + 1, 10));
    setError(null);
  };

  const handleDisminuir = () => {
    setCantidadGurus(prev => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleContinuar = () => {
    if (saldoUsuario < totalCreditos) {
      router.push(`/pago?evento=${eventoId}&cantidad=${cantidadGurus}&total=${totalCreditos}`);
      return;
    }
    
    router.push(`/eventos/${eventoId}/prediccion?cantidad=${cantidadGurus}`);
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-black">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <Flame className="w-8 h-8 text-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-gray-400">Cargando información...</p>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-black">
        <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-amber-400" />
        </div>
        <p className="text-gray-400">Evento no encontrado</p>
        <Button variant="outline" onClick={() => router.back()} className="rounded-full border-white/20 text-white hover:bg-white/10">
          Volver atrás
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Fondo lobby */}
      <div className="fixed inset-0 w-full h-full bg-[url('/img/lobby.jpg')] bg-cover bg-center opacity-30 z-[-2]" />
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90 z-[-1]" />
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[linear-gradient(rgba(141,198,63,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(141,198,63,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative z-10 max-w-2xl mx-auto space-y-6 py-8 px-4">
        
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
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-medium">Compra de Gurús</span>
            </div>
            <h1 className="text-xl font-bold mb-1">{evento.nombre}</h1>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Clock className="w-4 h-4" />
              <span>Cierra el {formatearFecha(evento.fecha_inicio)}</span>
            </div>
          </div>
        </div>

        {/* Saldo actual */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl rounded-2xl">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Coins className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-gray-300">Créditos disponibles:</span>
              </div>
              <div className="text-right">
                <span className={`text-xl font-bold ${saldoUsuario >= totalCreditos ? 'text-green-400' : 'text-red-400'}`}>
                  {saldoUsuario.toLocaleString()} créditos
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selector de cantidad */}
        <Card className="relative overflow-hidden bg-black/80 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl text-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-full blur-2xl" />
          
          <CardHeader>
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              ¿Cuántos Gurús quieres comprar?
            </CardTitle>
            <CardDescription className="text-gray-400">
              Cada Gurú te permite hacer {TOTAL_PREDICCIONES} predicciones
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center gap-6">
              <Button
                variant="outline"
                size="lg"
                className="w-12 h-12 rounded-full border-white/20 text-white hover:bg-white/10 hover:border-green-500"
                onClick={handleDisminuir}
                disabled={cantidadGurus === 1}
              >
                <Minus className="w-5 h-5" />
              </Button>
              <div className="text-center">
                <span className="text-5xl font-bold text-green-400">{cantidadGurus}</span>
                <p className="text-gray-400 mt-1">Gurús</p>
              </div>
              <Button
                variant="outline"
                size="lg"
                className="w-12 h-12 rounded-full border-white/20 text-white hover:bg-white/10 hover:border-green-500"
                onClick={handleAumentar}
                disabled={cantidadGurus === 10}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            <div className="bg-white/5 rounded-xl p-4 space-y-2 border border-white/10">
              <div className="flex justify-between">
                <span className="text-gray-400">Costo por Gurú:</span>
                <span className="font-medium text-white">{COSTO_POR_GURU} créditos</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2">
                <span className="font-semibold text-white">Total:</span>
                <span className="text-xl font-bold text-green-400">{totalCreditos} créditos</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Predicciones incluidas:</span>
                <span className="text-gray-400">{totalPredicciones} predicciones</span>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm flex items-center justify-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}
          </CardContent>
          
          <CardFooter>
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleContinuar}
            >
              {saldoUsuario >= totalCreditos ? (
                <>
                  Comprar {cantidadGurus} Gurú{cantidadGurus !== 1 ? 's' : ''}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  Recargar {(totalCreditos - saldoUsuario).toLocaleString()} créditos faltantes
                  <Coins className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Info adicional */}
        <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-400">¿Cómo funciona?</p>
              <p className="text-xs text-blue-400/70 mt-1">
                Cada Gurú incluye {TOTAL_PREDICCIONES} predicciones obligatorias. 
                Si aciertas, multiplicas tus créditos según el premio del evento.
                Puedes comprar hasta 10 Gurús por evento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}