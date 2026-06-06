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
  Check,
  Flame
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
        return <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 rounded-full">VIP</Badge>;
      case "PRIVADO":
        return <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 rounded-full">Privado</Badge>;
      default:
        return <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 rounded-full">Público</Badge>;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch(tipo) {
      case "VIP":
        return <Zap className="w-5 h-5 text-purple-400" />;
      case "PRIVADO":
        return <Lock className="w-5 h-5 text-amber-400" />;
      default:
        return <Trophy className="w-5 h-5 text-green-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-black">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <Flame className="w-8 h-8 text-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-gray-400">Cargando información del evento...</p>
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-black">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
          <p className="text-red-400 mb-4">{error || "Evento no encontrado"}</p>
          <Button variant="outline" onClick={() => router.back()} className="rounded-full border-white/20 text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver atrás
          </Button>
        </div>
      </div>
    );
  }

  const progreso = (evento.acumulado_actual / evento.limite_prediccion) * 100;

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
          className="mb-2 -ml-2 text-gray-400 hover:text-green-400 transition-colors rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a eventos
        </Button>

        {/* Header del evento */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {getTipoIcon(evento.tipo_evento)}
                  {getTipoBadge(evento.tipo_evento)}
                  <span className="text-sm text-white/70 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatearFecha(evento.fecha_inicio)}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {evento.nombre}
                </h1>
                <p className="text-white/70">
                  Campeonato: {evento.campeonato?.nombre || "No especificado"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 rounded-full border-white/20 text-white hover:bg-white/10"
                onClick={handleCompartir}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
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
        </div>

        {/* Información principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Premio y estadísticas */}
          <Card className="md:col-span-2 bg-white/5 backdrop-blur-sm border-white/10 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-amber-400" />
                </div>
                Premio acumulado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-4xl font-bold text-green-400">
                  {formatearMoneda(evento.acumulado_actual)} créditos
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Límite máximo por predicción: {formatearMoneda(evento.limite_prediccion)} créditos
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progreso del pozo</span>
                  <span className="text-white">{Math.min(progreso, 100).toFixed(1)}%</span>
                </div>
                <Progress value={Math.min(progreso, 100)} className="h-2 bg-gray-800" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                  <p className="text-xs text-gray-400">Comisión casa</p>
                  <p className="text-lg font-semibold text-white">{evento.porcentaje_casa}%</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                  <p className="text-xs text-gray-400">Aporte al pozo global</p>
                  <p className="text-lg font-semibold text-white">{evento.porcentaje_pozo}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acción de compra */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-green-600/20 backdrop-blur-sm border border-white/10 shadow-xl rounded-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-full blur-2xl" />
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Coins className="w-4 h-4 text-green-400" />
                </div>
                Comprar Gurú
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                <p className="text-sm text-gray-300">Premio potencial</p>
                <p className="text-2xl font-bold text-green-400">
                  +{evento.porcentaje_pozo}%
                </p>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
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
              <p className="text-xs text-gray-400 text-center">
                Al comprar un Gurú aceptas los términos y condiciones
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Partidos del evento */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-400" />
              </div>
              Partidos del evento
            </CardTitle>
          </CardHeader>
          <CardContent>
            {evento.partidos && evento.partidos.length > 0 ? (
              <div className="space-y-4">
                {evento.partidos.map((partido: any) => (
                  <div key={partido.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 justify-center md:justify-start">
                        <div className="text-right">
                          <p className="font-semibold text-white">{partido.equipo_local}</p>
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-bold text-gray-500 bg-white/10 px-3 py-1 rounded-full">VS</span>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-white">{partido.equipo_visitante}</p>
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
                    <Badge variant="outline" className="ml-4 rounded-full border-white/20 text-gray-300">
                      {partido.estado || "PROGRAMADO"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Info className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-400">Próximamente se publicarán los partidos</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información adicional */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <div className="w-8 h-8 bg-gray-500/20 rounded-full flex items-center justify-center">
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              ¿Cómo funciona?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-xl bg-white/5">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-blue-400">1</span>
                </div>
                <p className="font-medium text-white">Compra Gurú</p>
                <p className="text-sm text-gray-400">2 créditos por Gurú</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-blue-400">2</span>
                </div>
                <p className="font-medium text-white">Realiza tus predicciones</p>
                <p className="text-sm text-gray-400">10 predicciones por Gurú</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-blue-400">3</span>
                </div>
                <p className="font-medium text-white">Gana créditos</p>
                <p className="text-sm text-gray-400">Acierta y multiplica tu inversión</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}