"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Calendar, 
  Trophy, 
  Clock, 
  ArrowLeft,
  Coins,
  Zap,
  Lock,
  Info,
  ChevronRight,
  Loader2,
  Share2,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getEventoDetalle, Evento } from "@/services/eventos.service";
import { useAuthStore } from "@/store/auth.store";

export default function EventoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [comprando, setComprando] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eventoId = params.id as string;

  useEffect(() => {
    const cargarEvento = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEventoDetalle(eventoId);
        setEvento(data);
      } catch (err) {
        console.error("Error cargando evento:", err);
        setError("No se pudo cargar la información del evento");
      } finally {
        setLoading(false);
      }
    };

    if (eventoId) {
      cargarEvento();
    }
  }, [eventoId]);

  const handleComprarGuru = () => {
    if (!token) {
      router.push("/login");
      return;
    }
    // Redirigir a selección de partido
    router.push(`/eventos/${eventoId}/seleccionar-partido`);
  };

  const handleCompartir = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO').format(valor);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTipoBadge = (tipo: string) => {
    switch(tipo) {
      case "VIP":
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200">VIP</Badge>;
      case "PRIVADO":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Privado</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-700 border-green-200">Público</Badge>;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch(tipo) {
      case "VIP":
        return <Zap className="w-5 h-5 text-purple-500" />;
      case "PRIVADO":
        return <Lock className="w-5 h-5 text-amber-500" />;
      default:
        return <Trophy className="w-5 h-5 text-green-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-gray-500">Cargando información del evento...</p>
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Evento no encontrado"}</p>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver atrás
          </Button>
        </div>
      </div>
    );
  }

  const progreso = (evento.acumulado_actual / evento.limite_prediccion) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Botón volver */}
      <Button
        variant="ghost"
        className="mb-2 -ml-2 text-gray-600"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a eventos
      </Button>

      {/* Header del evento */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {getTipoIcon(evento.tipo_evento)}
              {getTipoBadge(evento.tipo_evento)}
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatearFecha(evento.fecha_inicio)}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {evento.nombre}
            </h1>
            <p className="text-gray-500">
              Campeonato: {evento.campeonato?.nombre || "No especificado"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleCompartir}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span>Copiado</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Compartir</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Información principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Premio y estadísticas */}
        <Card className="md:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Premio acumulado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-4xl font-bold text-green-600">
                {formatearMoneda(evento.acumulado_actual)} créditos
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Límite máximo por predicción: {formatearMoneda(evento.limite_prediccion)} créditos
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progreso del pozo</span>
                <span>{Math.min(progreso, 100).toFixed(1)}%</span>
              </div>
              <Progress value={Math.min(progreso, 100)} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Comisión casa</p>
                <p className="text-lg font-semibold text-gray-700">{evento.porcentaje_casa}%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Aporte al pozo global</p>
                <p className="text-lg font-semibold text-gray-700">{evento.porcentaje_pozo}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acción de compra */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-green-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Coins className="w-5 h-5 text-green-600" />
              Comprar Gurú
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-white/80 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Premio potencial</p>
              <p className="text-2xl font-bold text-green-600">
                +{evento.porcentaje_pozo}%
              </p>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg py-6"
              onClick={handleComprarGuru}
              disabled={comprando}
            >
              {comprando ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Procesando...
                </>
              ) : (
                <>
                  Comprar Gurú (2 créditos)
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Al comprar un Gurú aceptas los términos y condiciones
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Partidos del evento */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Partidos del evento
          </CardTitle>
        </CardHeader>
        <CardContent>
          {evento.partidos && evento.partidos.length > 0 ? (
            <div className="space-y-4">
              {evento.partidos.map((partido: any) => (
                <div key={partido.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                      <div className="text-right">
                        <p className="font-semibold">{partido.equipo_local}</p>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-bold text-gray-400">VS</span>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">{partido.equipo_visitante}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-2">
                      {new Date(partido.fecha).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-4">
                    {partido.estado || "PROGRAMADO"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Info className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Próximamente se publicarán los partidos</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="w-5 h-5 text-gray-500" />
            ¿Cómo funciona?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="font-bold text-blue-600">1</span>
              </div>
              <p className="font-medium">Compra Gurú</p>
              <p className="text-sm text-gray-500">2 créditos por Gurú</p>
            </div>
            <div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="font-bold text-blue-600">2</span>
              </div>
              <p className="font-medium">Realiza tus predicciones</p>
              <p className="text-sm text-gray-500">10 predicciones por Gurú</p>
            </div>
            <div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="font-bold text-blue-600">3</span>
              </div>
              <p className="font-medium">Gana créditos</p>
              <p className="text-sm text-gray-500">Acierta y multiplica tu inversión</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}