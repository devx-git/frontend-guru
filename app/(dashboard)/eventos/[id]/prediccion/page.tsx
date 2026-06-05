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
  Crown
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-ping opacity-20 absolute" />
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 relative" />
        </div>
        <p className="text-gray-500 font-medium">Preparando tu Gurú...</p>
        <p className="text-sm text-gray-400">Estamos cargando las predicciones para ti</p>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <p className="text-gray-500">Evento no encontrado</p>
        <Button variant="outline" onClick={() => router.back()} className="rounded-xl">
          Volver atrás
        </Button>
      </div>
    );
  }

  if (!partidoId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-amber-500" />
        </div>
        <p className="text-gray-500">No se seleccionó un partido</p>
        <Button variant="outline" onClick={() => router.back()} className="rounded-xl">
          Volver a seleccionar partido
        </Button>
      </div>
    );
  }

  const mostrarMultipleGurus = cantidadGurus > 1;

  if (confirmado) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
        <Button
          variant="ghost"
          className="mb-2 -ml-2 text-gray-600 hover:text-blue-600 transition-colors"
          onClick={() => setConfirmado(false)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a predicciones
        </Button>

        <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-green-500 to-emerald-500" />
          <CardHeader className="text-center pt-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {mostrarMultipleGurus ? `Revisa tu Gurú #${guruActual}` : "Revisa tu predicción"}
            </CardTitle>
            <CardDescription>
              Confirma que tus selecciones son correctas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {eventosPrediccion.map((prediccion, idx) => {
              const opcionSeleccionada = prediccion.opciones.find(
                o => o.id === predicciones[prediccion.id]
              );
              return (
                <div key={prediccion.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-blue-500 bg-blue-100 px-2 py-0.5 rounded-full">
                      #{idx + 1}
                    </span>
                    <span className="text-xs text-gray-400">Predicción</span>
                  </div>
                  <p className="font-medium text-gray-700">{prediccion.descripcion}</p>
                  <div className="mt-2 inline-flex items-center gap-1 bg-gradient-to-r from-blue-50 to-green-50 px-3 py-1.5 rounded-lg">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <p className="text-blue-600 font-semibold">
                      {opcionSeleccionada?.valor || "No seleccionado"}
                    </p>
                  </div>
                </div>
              );
            })}
            
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mt-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-800">Importante</p>
                  <p className="text-sm text-amber-700">
                    Una vez confirmada, no podrás modificar tu predicción. Asegúrate de que todas las opciones sean correctas.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 p-6 pt-0">
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl py-6 text-lg"
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
              className="w-full rounded-xl border-gray-200 hover:border-blue-200"
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
    <div className="max-w-2xl mx-auto space-y-6 py-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-6">
      {/* Alerta de éxito */}
      {showSuccessAlert && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl shadow-2xl p-4 max-w-md">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-green-800">¡Predicción registrada!</p>
                <p className="text-xs text-green-700 mt-1">{successMessage}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Mail className="w-3 h-3" />
                    <span>Correo enviado</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <BellRing className="w-3 h-3" />
                    <span>Notificación activa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Header con gradiente */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="-ml-2 text-gray-600 hover:text-blue-600 transition-colors rounded-xl"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
          <Coins className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-semibold text-gray-700">2 créditos por Gurú</span>
        </div>
      </div>

      {/* Info del evento con gradiente */}
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

      {/* Progreso con diseño mejorado */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            Paso {pasoActual + 1} de {eventosPrediccion.length}
          </span>
          <span className="font-semibold text-blue-600">{Math.round(porcentajeProgreso)}%</span>
        </div>
        <Progress value={porcentajeProgreso} className="h-2 bg-gray-100" />
        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
          <Gift className="w-3 h-3" />
          Completa los 10 pasos para finalizar tu Gurú
        </p>
      </div>

      {/* Predicción actual con diseño premium */}
      <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500" />
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Predicción #{pasoActual + 1}</span>
          </div>
          <CardTitle className="text-xl font-bold text-gray-800">{prediccionActual?.descripcion}</CardTitle>
          <CardDescription>
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
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                onClick={() => handleSeleccionarOpcion(prediccionActual?.id, opcion.id)}
              >
                <RadioGroupItem value={opcion.id} id={opcion.id} />
                <Label htmlFor={opcion.id} className="flex-1 cursor-pointer font-normal text-gray-700 group-hover:text-gray-900">
                  {opcion.valor}
                </Label>
                {predicciones[prediccionActual?.id] === opcion.id && (
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                )}
              </div>
            ))}
          </RadioGroup>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between gap-3 p-6 pt-0">
          <Button
            variant="outline"
            onClick={handleAnterior}
            disabled={pasoActual === 0}
            className="flex-1 rounded-xl border-gray-200 hover:border-blue-200"
          >
            Anterior
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl py-5"
            onClick={handleSiguiente}
          >
            {pasoActual === eventosPrediccion.length - 1 ? "📋 Revisar" : "➡️ Siguiente"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>

      {/* Información adicional */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 text-center">
        <p className="text-xs text-gray-500">
          Estás creando un Gurú con 10 predicciones. Cada acierto suma puntos para el pozo final.
        </p>
      </div>
    </div>
  );
}