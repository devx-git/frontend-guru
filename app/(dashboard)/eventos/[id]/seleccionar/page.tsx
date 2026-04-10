"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trophy, 
  Calendar, 
  Clock,
  Coins,
  AlertCircle,
  Loader2,
  ShoppingCart,
  ChevronRight,
  Zap
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
  const TOTAL_PREDICCIONES = 10; // Por cada Gurú

  useEffect(() => {
      const cargarDatos = async () => {
        try {
          setLoading(true);
          const eventoData = await getEventoDetalle(eventoId);
          setEvento(eventoData);
          
          // Obtener saldo real
          const saldo = await saldoService.getSaldo();
          console.log("Saldo en seleccionar:", saldo);
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
    setCantidadGurus(prev => Math.min(prev + 1, 10)); // Máximo 10 Gurús
    setError(null);
  };

  const handleDisminuir = () => {
    setCantidadGurus(prev => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleContinuar = () => {
    if (saldoUsuario < totalCreditos) {
      // Redirigir a pago con los datos de la selección
      router.push(`/pago?evento=${eventoId}&cantidad=${cantidadGurus}&total=${totalCreditos}`);
      return;
    }
    
    // Si tiene saldo suficiente, ir a predicciones
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-gray-500">Cargando información...</p>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-amber-500" />
        <p className="text-gray-500">Evento no encontrado</p>
        <Button variant="outline" onClick={() => router.back()}>
          Volver atrás
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-8">
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

      {/* Saldo actual */}
      <Card className="border-0 shadow-sm bg-gray-50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-green-600" />
              <span className="text-gray-600">Créditos disponibles:</span>
            </div>
            <div className="text-right">
              <span className={`text-xl font-bold ${saldoUsuario >= totalCreditos ? 'text-green-600' : 'text-red-500'}`}>
                {saldoUsuario.toLocaleString()} créditos
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selector de cantidad */}
      <Card className="border-0 shadow-lg text-center">
        <CardHeader>
          <CardTitle className="text-2xl">¿Cuántos Gurús quieres comprar?</CardTitle>
          <CardDescription>
            Cada Gurú te permite hacer {TOTAL_PREDICCIONES} predicciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center gap-6">
            <Button
              variant="outline"
              size="lg"
              className="w-12 h-12 rounded-full"
              onClick={handleDisminuir}
              disabled={cantidadGurus === 1}
            >
              <Minus className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <span className="text-5xl font-bold text-blue-600">{cantidadGurus}</span>
              <p className="text-gray-500 mt-1">Gurús</p>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="w-12 h-12 rounded-full"
              onClick={handleAumentar}
              disabled={cantidadGurus === 10}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Costo por Gurú:</span>
              <span className="font-medium">{COSTO_POR_GURU} créditos</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold text-green-600">{totalCreditos} créditos</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Predicciones incluidas:</span>
              <span>{totalPredicciones} predicciones</span>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm flex items-center justify-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 py-6 text-lg"
            onClick={handleContinuar}
          >
            {saldoUsuario >= totalCreditos ? (
              <>
                Comprar {cantidadGurus} Gurú{cantidadGurus !== 1 ? 's' : ''}
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Recargar {totalCreditos - saldoUsuario} créditos faltantes
                <Coins className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Info adicional */}
      <div className="bg-blue-50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">¿Cómo funciona?</p>
            <p className="text-xs text-blue-700 mt-1">
              Cada Gurú incluye {TOTAL_PREDICCIONES} predicciones obligatorias. 
              Si aciertas, multiplicas tus créditos según el premio del evento.
              Puedes comprar hasta 10 Gurús por evento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}