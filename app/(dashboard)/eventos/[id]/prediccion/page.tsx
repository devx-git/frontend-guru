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
  Shield
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

// Función para generar opciones mock basadas en la descripción del evento
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
      { id: generarId(), valor: "Local gana" },
      { id: generarId(), valor: "Empate" },
      { id: generarId(), valor: "Visitante gana" }
    ];
  }
  if (descripcion.includes("Doble oportunidad")) {
    return [
      { id: generarId(), valor: "Local o Empate" },
      { id: generarId(), valor: "Local o Visitante" },
      { id: generarId(), valor: "Empate o Visitante" }
    ];
  }
  if (descripcion.includes("marcan") || descripcion.includes("Ambos equipos")) {
    return [
      { id: generarId(), valor: "✅ Sí" },
      { id: generarId(), valor: "❌ No" }
    ];
  }
  if (descripcion.includes("penal")) {
    return [
      { id: generarId(), valor: "✅ Sí" },
      { id: generarId(), valor: "❌ No" }
    ];
  }
  if (descripcion.includes("tarjeta roja")) {
    return [
      { id: generarId(), valor: "✅ Sí" },
      { id: generarId(), valor: "❌ No" }
    ];
  }
  if (descripcion.includes("Gol en ambos tiempos")) {
    return [
      { id: generarId(), valor: "✅ Sí" },
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
      { id: generarId(), valor: "🏠 Local" },
      { id: generarId(), valor: "✈️ Visitante" },
      { id: generarId(), valor: "🤝 Igual" }
    ];
  }
  if (descripcion.includes("tarjetas")) {
    return [
      { id: generarId(), valor: "🏠 Local" },
      { id: generarId(), valor: "✈️ Visitante" },
      { id: generarId(), valor: "🤝 Igual" }
    ];
  }
  
  // Opciones por defecto
  return [
    { id: generarId(), valor: "Opción 1" },
    { id: generarId(), valor: "Opción 2" }
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

  // Cargar eventos de predicción reales desde el backend
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
      
      // Obtener el partido específico
      const response = await fetch(
        `https://api.devxsolutions.pro/eventos/${eventoId}/detalle`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const eventoCompleto = await response.json();
      const partido = eventoCompleto.partidos?.find((p: any) => p.id === partidoId);
      
      if (!partido) {
        throw new Error("Partido no encontrado");
      }
      
      // Generar predicciones dinámicas
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

  // Función para enviar todas las predicciones al backend
  const enviarTodasPredicciones = async () => {
    setEnviando(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      
      // Obtener saldo actual del usuario
      const saldoActual = await saldoService.getSaldo();
      const totalCreditos = cantidadGurus * 2;
      
      console.log("=== VALIDACIÓN DE SALDO ===");
      console.log("Saldo actual:", saldoActual);
      console.log("Total a gastar:", totalCreditos);
      
      // Validar saldo
      if (saldoActual < totalCreditos) {
        console.log("Saldo insuficiente, redirigiendo a pago");
        router.push(`/pago?evento=${eventoId}&cantidad=${cantidadGurus}&total=${totalCreditos}&partidoId=${partidoId}`);
        return;
      }
      
      console.log("✅ Saldo suficiente, procesando predicciones...");
      
      // Recorrer cada Gurú comprado
      for (let i = 0; i < prediccionesPorGuru.length; i++) {
        const prediccionesGuru = prediccionesPorGuru[i];
        
        // Convertir predicciones al formato que espera el backend (snake_case)
        const seleccionesArray = Object.entries(prediccionesGuru).map(([eventoPrediccionId, opcionId]) => ({
          evento_prediccion_id: eventoPrediccionId,
          valor_elegido: opcionId
        }));
        
        console.log(`📝 Guardando Gurú #${i + 1} con ${seleccionesArray.length} selecciones`);
         
        // Llamada al endpoint POST /predicciones
        const response = await fetch("https://api.devxsolutions.pro/predicciones", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            eventoId: eventoId,
            selecciones: seleccionesArray
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error guardando predicción:", errorData);
          throw new Error(`Error ${response.status}: ${errorData.message || "No se pudo guardar la predicción"}`);
        }
        
        const result = await response.json();
        console.log(`✅ Gurú #${i + 1} guardado:`, result);
        
        // ============================================
        // DESCONTAR CRÉDITOS DESPUÉS DE CADA GURÚ
        // ============================================
      const descuentoExitoso = await saldoService.descontarCreditos(2, `Compra de Gurú #${i + 1} para partido`);
      if (!descuentoExitoso) {
        console.error("⚠️ Error al descontar créditos para Gurú #", i + 1);
      } else {
        console.log(`💰 Descontados 2 créditos por Gurú #${i + 1}`);
      }
    }
      
      // Enviar notificación por correo (simulado)
      const emailEnviado = await notificacionService.enviarEmailConfirmacion(
        user?.email || "usuario@guru.com",
        evento?.nombre || "Evento",
        cantidadGurus
      );
      
      // Crear notificación local para la campanita
      const nuevaNotificacion = await notificacionService.crearNotificacionLocal(
        "🎉 Gurú confirmado",
        `Has comprado ${cantidadGurus} Gurú(s) para "${evento?.nombre}". Se descontaron ${totalCreditos} créditos. Tu predicción ha sido registrada.`
      );
      
      // Guardar notificación en localStorage
      const notificacionesGuardadas = localStorage.getItem("notificaciones");
      const notificaciones = notificacionesGuardadas ? JSON.parse(notificacionesGuardadas) : [];
      notificaciones.unshift(nuevaNotificacion);
      localStorage.setItem("notificaciones", JSON.stringify(notificaciones.slice(0, 20)));
      
      // Mostrar mensaje de éxito
      setSuccessMessage(
        `✅ ¡Éxito! Has comprado ${cantidadGurus} Gurú(s) para "${evento?.nombre}". Se descontaron ${totalCreditos} créditos. ${emailEnviado ? "Te hemos enviado un correo de confirmación." : ""}`
      );
      setShowSuccessAlert(true);
      
      // Ocultar alerta después de 5 segundos
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);
      
      // Redirigir después de un momento - USANDO window.location.href en lugar de router.push
      setTimeout(() => {
        window.location.href = `/eventos/${eventoId}/exito?cantidad=${cantidadGurus}&creditos=${totalCreditos}`;
      }, 2000);
      
    } catch (error) {
      console.error("Error enviando predicciones:", error);
      setError(error instanceof Error ? error.message : "Error al enviar tus predicciones. Intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  // Al finalizar un Gurú, pasar al siguiente
  const handleSiguienteGuru = () => {
    // Guardar predicciones del Gurú actual
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-gray-500">Preparando tu Gurú...</p>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Evento no encontrado</p>
        <Button variant="outline" onClick={() => router.back()}>
          Volver atrás
        </Button>
      </div>
    );
  }

  if (!partidoId) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">No se seleccionó un partido</p>
        <Button variant="outline" onClick={() => router.back()}>
          Volver a seleccionar partido
        </Button>
      </div>
    );
  }

  const mostrarMultipleGurus = cantidadGurus > 1;

  if (confirmado) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Button
          variant="ghost"
          className="mb-2 -ml-2 text-gray-600"
          onClick={() => setConfirmado(false)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a predicciones
        </Button>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">
              {mostrarMultipleGurus ? `Revisa tu Gurú #${guruActual}` : "Revisa tu predicción"}
            </CardTitle>
            <CardDescription>
              Confirma que tus selecciones son correctas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {eventosPrediccion.map((prediccion) => {
              const opcionSeleccionada = prediccion.opciones.find(
                o => o.id === predicciones[prediccion.id]
              );
              return (
                <div key={prediccion.id} className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-700">{prediccion.descripcion}</p>
                  <p className="text-blue-600 font-semibold mt-1">
                    {opcionSeleccionada?.valor || "No seleccionado"}
                  </p>
                </div>
              );
            })}
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Importante</p>
                  <p className="text-sm text-amber-700">
                    Una vez confirmada, no podrás modificar tu predicción. Asegúrate de que todas las opciones sean correctas.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              onClick={handleSiguienteGuru}
              disabled={enviando}
            >
              {enviando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  {guruActual === cantidadGurus ? "Confirmar y enviar todo" : "Confirmar y continuar con siguiente Gurú"}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full"
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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Alerta de éxito */}
      {showSuccessAlert && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 max-w-md">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">¡Predicción registrada!</p>
                <p className="text-xs text-green-700 mt-1">{successMessage}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
                  <Mail className="w-3 h-3" />
                  <span>Revisa tu correo</span>
                  <BellRing className="w-3 h-3 ml-2" />
                  <span>Notificación en campanita</span>
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
          className="-ml-2 text-gray-600"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Coins className="w-4 h-4" />
          <span>2 créditos por Gurú</span>
        </div>
      </div>

      {/* Info del evento */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-5 h-5" />
          <span className="text-sm font-medium">
            {mostrarMultipleGurus ? `Gurú ${guruActual} de ${cantidadGurus}` : "Gurú activo"}
          </span>
        </div>
        <h1 className="text-xl font-bold mb-1">{evento.nombre}</h1>
        <div className="flex items-center gap-2 text-sm text-white/80">
          <Clock className="w-4 h-4" />
          <span>Cierra el {new Date(evento.fecha_inicio).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Progreso */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Paso {pasoActual + 1} de {eventosPrediccion.length}</span>
          <span>{Math.round(porcentajeProgreso)}% completado</span>
        </div>
        <Progress value={porcentajeProgreso} className="h-2" />
      </div>

      {/* Predicción actual */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Predicción #{pasoActual + 1}</span>
          </div>
          <CardTitle className="text-xl">{prediccionActual?.descripcion}</CardTitle>
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
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer
                  ${predicciones[prediccionActual?.id] === opcion.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
                onClick={() => handleSeleccionarOpcion(prediccionActual?.id, opcion.id)}
              >
                <RadioGroupItem value={opcion.id} id={opcion.id} />
                <Label htmlFor={opcion.id} className="flex-1 cursor-pointer font-normal">
                  {opcion.valor}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {error && (
            <p className="text-red-500 text-sm mt-3 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between gap-3">
          <Button
            variant="outline"
            onClick={handleAnterior}
            disabled={pasoActual === 0}
            className="flex-1"
          >
            Anterior
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            onClick={handleSiguiente}
          >
            {pasoActual === eventosPrediccion.length - 1 ? "Revisar" : "Siguiente"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}