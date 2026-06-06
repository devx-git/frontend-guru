// app/(dashboard)/eventos/[id]/prediccion/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  Trophy, 
  Clock, 
  Coins, 
  AlertCircle,
  Loader2,
  ChevronRight,
  Shield,
  Sparkles,
  Zap,
  Star,
  TrendingUp,
  Gift,
  Crown,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { getEventoDetalle, Evento } from "@/services/eventos.service";
import { useAuthStore } from "@/store/auth.store";
import { notificacionService } from "@/services/notificacion.service";
import { saldoService } from "@/services/saldo.service";
import { CheckCircle, Mail, BellRing } from "lucide-react";
import { seleccionarPrediccionesAleatorias } from "@/services/prediccion.service";

interface OpcionPrediccion {
  id: string;
  valor: string;
}

interface EventoPrediccion {
  id: string;
  descripcion: string;
  tipo: string;
  opciones: OpcionPrediccion[];
}

function generarOpcionesMock(descripcion: string): Array<{ id: string; valor: string }> {
  const generarId = () => Math.random().toString(36).substring(2, 10);
  
  if (descripcion.includes("Ganador") || descripcion.includes("partido")) {
    return [
      { id: generarId(), valor: "🏠 Local" },
      { id: generarId(), valor: "🤝 Empate" },
      { id: generarId(), valor: "✈️ Visitante" }
    ];
  }
  if (descripcion.includes("Resultado al descanso")) {
    return [
      { id: generarId(), valor: "🏠 Local gana" },
      { id: generarId(), valor: "🤝 Empate" },
      { id: generarId(), valor: "✈️ Visitante gana" }
    ];
  }
  if (descripcion.includes("Doble oportunidad")) {
    return [
      { id: generarId(), valor: "🏠 Local o Empate" },
      { id: generarId(), valor: "🏠 Local o Visitante" },
      { id: generarId(), valor: "🤝 Empate o Visitante" }
    ];
  }
  if (descripcion.includes("marcan") || descripcion.includes("Ambos equipos")) {
    return [
      { id: generarId(), valor: "✅ Sí, marcan" },
      { id: generarId(), valor: "❌ No marcan" }
    ];
  }
  if (descripcion.includes("penal")) {
    return [
      { id: generarId(), valor: "✅ Habrá penal" },
      { id: generarId(), valor: "❌ No habrá penal" }
    ];
  }
  if (descripcion.includes("tarjeta roja")) {
    return [
      { id: generarId(), valor: "✅ Habrá tarjeta roja" },
      { id: generarId(), valor: "❌ No habrá tarjeta roja" }
    ];
  }
  if (descripcion.includes("Gol en ambos tiempos")) {
    return [
      { id: generarId(), valor: "✅ Sí, en ambos" },
      { id: generarId(), valor: "❌ No" }
    ];
  }
  if (descripcion.includes("Primer equipo")) {
    return [
      { id: generarId(), valor: "🏠 Local" },
      { id: generarId(), valor: "✈️ Visitante" },
      { id: generarId(), valor: "⚪ Ninguno" }
    ];
  }
  if (descripcion.includes("corners")) {
    return [
      { id: generarId(), valor: "🏠 Más córners Local" },
      { id: generarId(), valor: "✈️ Más córners Visitante" },
      { id: generarId(), valor: "🤝 Igual cantidad" }
    ];
  }
  if (descripcion.includes("tarjetas")) {
    return [
      { id: generarId(), valor: "🏠 Más tarjetas Local" },
      { id: generarId(), valor: "✈️ Más tarjetas Visitante" },
      { id: generarId(), valor: "🤝 Igual cantidad" }
    ];
  }
  
  return [
    { id: generarId(), valor: "⭐ Opción A" },
    { id: generarId(), valor: "⭐ Opción B" }
  ];
}

export default function PrediccionPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, user } = useAuthStore();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predicciones, setPredicciones] = useState<Record<string, string>>({});
  const [eventosPrediccion, setEventosPrediccion] = useState<EventoPrediccion[]>([]);
  const [pasoActual, setPasoActual] = useState(0);
  const [confirmado, setConfirmado] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const cantidadGurus = parseInt(searchParams.get("cantidad") || "1");
  const partidoId = searchParams.get("partidoId");
  const [guruActual, setGuruActual] = useState(1);
  const [prediccionesPorGuru, setPrediccionesPorGuru] = useState<Record<string, string>[]>([]);
  
  const eventoId = params.id as string;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const eventoData = await getEventoDetalle(eventoId);
        setEvento(eventoData);
        
        if (!partidoId) {
          setError("No se seleccionó un partido");
          setLoading(false);
          return;
        }
        
        const response = await fetch(
          `https://api.devxsolutions.pro/eventos/${eventoId}/detalle`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        const eventoCompleto = await response.json();
        const partido = eventoCompleto.partidos?.find((p: any) => p.id === partidoId);
        
        if (!partido) {
          throw new Error("Partido no encontrado");
        }
        
        const prediccionesDinamicas = seleccionarPrediccionesAleatorias(
          partido.equipo_local,
          partido.equipo_visitante,
          10
        );
        setEventosPrediccion(prediccionesDinamicas);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("No se pudo cargar la información para realizar la predicción");
      } finally {
        setLoading(false);
      }
    };
    
    if (eventoId && partidoId) {
      cargarDatos();
    }
  }, [eventoId, partidoId, token]);

  const handleSeleccionarOpcion = (prediccionId: string, opcionId: string) => {
    setPredicciones(prev => ({
      ...prev,
      [prediccionId]: opcionId
    }));
  };

  const handleSiguiente = () => {
    const prediccionActual = eventosPrediccion[pasoActual];
    if (!predicciones[prediccionActual.id]) {
      setError("Por favor selecciona una opción");
      return;
    }
    setError(null);
    if (pasoActual < eventosPrediccion.length - 1) {
      setPasoActual(pasoActual + 1);
    } else {
      setConfirmado(true);
    }
  };

  const handleAnterior = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1);
      setError(null);
    }
  };

  const enviarTodasPredicciones = async () => {
    setEnviando(true);
    try {
      const tokenLocal = localStorage.getItem("token");
      if (!tokenLocal) {
        router.push("/login");
        return;
      }
      
      const saldoActual = await saldoService.getSaldo();
      const totalCreditos = cantidadGurus * 2;
      
      if (saldoActual < totalCreditos) {
        router.push(`/pago?evento=${eventoId}&cantidad=${cantidadGurus}&total=${totalCreditos}&partidoId=${partidoId}`);
        return;
      }
      
      for (let i = 0; i < prediccionesPorGuru.length; i++) {
        const prediccionesGuru = prediccionesPorGuru[i];
        const seleccionesArray = Object.entries(prediccionesGuru).map(([eventoPrediccionId, opcionId]) => ({
          evento_prediccion_id: eventoPrediccionId,
          valor_elegido: opcionId
        }));
        
        const response = await fetch("https://api.devxsolutions.pro/predicciones", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenLocal}`
          },
          body: JSON.stringify({
            eventoId: eventoId,
            selecciones: seleccionesArray
          })
        });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudo guardar la predicción`);
        }
        
        await saldoService.descontarCreditos(2, `Compra de Gurú #${i + 1} para ${evento?.nombre}`);
      }
      
      await notificacionService.enviarEmailConfirmacion(
        user?.email || "usuario@guru.com",
        evento?.nombre || "Evento",
        cantidadGurus
      );
      
      const nuevaNotificacion = await notificacionService.crearNotificacionLocal(
        "🎉 Gurú confirmado",
        `Has comprado ${cantidadGurus} Gurú(s) para "${evento?.nombre}". Se descontaron ${totalCreditos} créditos.`
      );
      
      const notificacionesGuardadas = localStorage.getItem("notificaciones");
      const notificaciones = notificacionesGuardadas ? JSON.parse(notificacionesGuardadas) : [];
      notificaciones.unshift(nuevaNotificacion);
      localStorage.setItem("notificaciones", JSON.stringify(notificaciones.slice(0, 20)));
      
      setSuccessMessage(`✅ ¡Éxito! Has comprado ${cantidadGurus} Gurú(s) para "${evento?.nombre}". Se descontaron ${totalCreditos} créditos.`);
      setShowSuccessAlert(true);
      
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);
      
      setTimeout(() => {
        window.location.href = `/eventos/${eventoId}/exito?cantidad=${cantidadGurus}&creditos=${totalCreditos}`;
      }, 2000);
      
    } catch (error) {
      console.error("Error enviando predicciones:", error);
      setError(error instanceof Error ? error.message : "Error al enviar tus predicciones.");
    } finally {
      setEnviando(false);
    }
  };

  const handleSiguienteGuru = () => {
    setPrediccionesPorGuru(prev => [...prev, predicciones]);
    if (guruActual < cantidadGurus) {
      setGuruActual(guruActual + 1);
      setPredicciones({});
      setPasoActual(0);
      setConfirmado(false);
    } else {
      enviarTodasPredicciones();
    }
  };

  const prediccionActual = eventosPrediccion[pasoActual];
  const porcentajeProgreso = ((pasoActual + 1) / eventosPrediccion.length) * 100;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-black">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-ping opacity-20 absolute" />
          <Loader2 className="w-16 h-16 animate-spin text-green-500 relative" />
        </div>
        <p className="text-gray-400 font-medium">Preparando tu Gurú...</p>
        <p className="text-sm text-gray-500">Estamos cargando las predicciones para ti</p>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-black">
        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-red-400" />
        </div>
        <p className="text-gray-400">Evento no encontrado</p>
        <Button variant="outline" onClick={() => router.back()} className="rounded-full border-white/20 text-white hover:bg-white/10">
          Volver atrás
        </Button>
      </div>
    );
  }

  if (!partidoId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-black">
        <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-amber-400" />
        </div>
        <p className="text-gray-400">No se seleccionó un partido</p>
        <Button variant="outline" onClick={() => router.back()} className="rounded-full border-white/20 text-white hover:bg-white/10">
          Volver a seleccionar partido
        </Button>
      </div>
    );
  }

  const mostrarMultipleGurus = cantidadGurus > 1;

  if (confirmado) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-8 bg-black min-h-screen p-6">
        
        {/* Fondo lobby */}
        <div className="fixed inset-0 w-full h-full bg-[url('/img/lobby.jpg')] bg-cover bg-center opacity-30 z-[-2]" />
        <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90 z-[-1]" />

        <Button
          variant="ghost"
          className="mb-2 -ml-2 text-gray-400 hover:text-green-400 transition-colors rounded-full"
          onClick={() => setConfirmado(false)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a predicciones
        </Button>

        <Card className="relative bg-black/80 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-green-500 to-emerald-500" />
          <CardHeader className="text-center pt-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {mostrarMultipleGurus ? `Revisa tu Gurú #${guruActual}` : "Revisa tu predicción"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              Confirma que tus selecciones son correctas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {eventosPrediccion.map((prediccion, idx) => {
              const opcionSeleccionada = prediccion.opciones.find(
                o => o.id === predicciones[prediccion.id]
              );
              return (
                <div key={prediccion.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full">
                      #{idx + 1}
                    </span>
                    <span className="text-xs text-gray-500">Predicción</span>
                  </div>
                  <p className="font-medium text-white">{prediccion.descripcion}</p>
                  <div className="mt-2 inline-flex items-center gap-1 bg-gradient-to-r from-blue-500/20 to-green-500/20 px-3 py-1.5 rounded-lg">
                    <Sparkles className="w-3 h-3 text-green-400" />
                    <p className="text-green-400 font-semibold">
                      {opcionSeleccionada?.valor || "No seleccionado"}
                    </p>
                  </div>
                </div>
              );
            })}
            
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mt-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-400">Importante</p>
                  <p className="text-sm text-amber-400/70">
                    Una vez confirmada, no podrás modificar tu predicción. Asegúrate de que todas las opciones sean correctas.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 p-6 pt-0">
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full py-6 text-lg"
              onClick={handleSiguienteGuru}
              disabled={enviando}
            >
              {enviando ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  {guruActual === cantidadGurus ? "✅ Confirmar y enviar todo" : "✅ Confirmar y continuar"}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full border-white/20 text-white hover:bg-white/10 hover:border-green-500"
              onClick={() => setConfirmado(false)}
            >
              Volver a editar
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-8 bg-black min-h-screen p-6 relative">
      
      {/* Fondo lobby */}
      <div className="fixed inset-0 w-full h-full bg-[url('/img/lobby.jpg')] bg-cover bg-center opacity-30 z-[-2]" />
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90 z-[-1]" />
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[linear-gradient(rgba(141,198,63,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(141,198,63,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative z-10">
        
        {/* Alerta de éxito */}
        {showSuccessAlert && (
          <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md border border-green-500/30 rounded-2xl shadow-2xl p-4 max-w-md">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-green-400">¡Predicción registrada!</p>
                  <p className="text-xs text-green-400/70 mt-1">{successMessage}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-xs text-green-400">
                      <Mail className="w-3 h-3" />
                      <span>Correo enviado</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-400">
                      <BellRing className="w-3 h-3" />
                      <span>Notificación activa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="-ml-2 text-gray-400 hover:text-green-400 transition-colors rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-gray-300">2 créditos por Gurú</span>
          </div>
        </div>

        {/* Info del evento */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 animate-gradient" />
          <div className="relative p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              {mostrarMultipleGurus ? (
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Crown className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-medium">Gurú {guruActual} de {cantidadGurus}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Gurú activo</span>
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold mb-2">{evento.nombre}</h1>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Clock className="w-4 h-4" />
              <span>Cierra el {new Date(evento.fecha_inicio).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Progreso */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Paso {pasoActual + 1} de {eventosPrediccion.length}
            </span>
            <span className="font-semibold text-green-400">{Math.round(porcentajeProgreso)}%</span>
          </div>
          <Progress value={porcentajeProgreso} className="h-2 bg-gray-800" />
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <Gift className="w-3 h-3" />
            Completa los 10 pasos para finalizar tu Gurú
          </p>
        </div>

        {/* Predicción actual */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 shadow-xl rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500" />
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Predicción #{pasoActual + 1}</span>
            </div>
            <CardTitle className="text-xl font-bold text-white">{prediccionActual?.descripcion}</CardTitle>
            <CardDescription className="text-gray-400">
              Selecciona una opción para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={predicciones[prediccionActual?.id]}
              onValueChange={(value) => handleSeleccionarOpcion(prediccionActual?.id, value)}
              className="space-y-3"
            >
              {prediccionActual?.opciones.map((opcion) => (
                <div
                  key={opcion.id}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer group
                    ${predicciones[prediccionActual?.id] === opcion.id 
                      ? 'border-green-500 bg-gradient-to-r from-green-500/20 to-emerald-500/20 shadow-md' 
                      : 'border-white/10 hover:border-green-500/50 hover:bg-white/5'
                    }`}
                  onClick={() => handleSeleccionarOpcion(prediccionActual?.id, opcion.id)}
                >
                  <RadioGroupItem value={opcion.id} id={opcion.id} />
                  <Label htmlFor={opcion.id} className="flex-1 cursor-pointer font-normal text-gray-300 group-hover:text-white">
                    {opcion.valor}
                  </Label>
                  {predicciones[prediccionActual?.id] === opcion.id && (
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  )}
                </div>
              ))}
            </RadioGroup>
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between gap-3 p-6 pt-0">
            <Button
              variant="outline"
              onClick={handleAnterior}
              disabled={pasoActual === 0}
              className="flex-1 rounded-full border-white/20 text-white hover:bg-white/10 hover:border-green-500"
            >
              Anterior
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-300 rounded-full py-5"
              onClick={handleSiguiente}
            >
              {pasoActual === eventosPrediccion.length - 1 ? "📋 Revisar" : "➡️ Siguiente"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>

        {/* Información adicional */}
        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
          <p className="text-xs text-gray-400">
            Estás creando un Gurú con 10 predicciones. Cada acierto suma puntos para el pozo final.
          </p>
        </div>
      </div>
    </div>
  );
}