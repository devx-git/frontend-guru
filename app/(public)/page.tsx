"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getEventosActivos, Evento } from "@/services/eventos.service";
import Link from "next/link";
import { CalendarDays, Trophy, Users, TrendingUp, Lock, Sparkles } from "lucide-react";

export default function Home() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEventos = async () => {
      try {
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

  // Función para formatear moneda
  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  };

  // Función para obtener badge según tipo de evento
  const getTipoEventoBadge = (tipo: string) => {
    switch(tipo) {
      case "VIP":
        return <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center"><Sparkles className="w-3 h-3 mr-1" />VIP</span>;
      case "PRIVADO":
        return <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full flex items-center"><Lock className="w-3 h-3 mr-1" />Privado</span>;
      default:
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Público</span>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Gurú</h1>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Gana con tu <span className="text-blue-600">conocimiento deportivo</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Compra Gurús, predice resultados y multiplica tus créditos. La primera plataforma que premia tu intuición.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/register">Comenzar ahora</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="#eventos">Ver eventos</Link>
            </Button>
          </div>

          {/* Stats rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div>
              <div className="text-3xl font-bold text-blue-600">+5K</div>
              <div className="text-gray-600">Usuarios</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">+50</div>
              <div className="text-gray-600">Eventos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">+$50M</div>
              <div className="text-gray-600">En premios</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">50K+</div>
              <div className="text-gray-600">Predicciones</div>
            </div>
          </div>
        </div>
      </section>

      {/* Eventos Disponibles */}
      <section id="eventos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Eventos disponibles 🔥</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Compra Gurús en los eventos activos y comienza a ganar
          </p>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando eventos...</p>
            </div>
          ) : eventos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay eventos disponibles en este momento</p>
              <p className="text-sm text-gray-500 mt-2">Vuelve pronto o revisa nuestros próximos eventos</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventos.map((evento) => (
                <Card key={evento.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{evento.nombre}</CardTitle>
                      {getTipoEventoBadge(evento.tipo_evento)}
                    </div>
                    <CardDescription>
                      Inicia: {new Date(evento.fecha_inicio).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Acumulado actual:</span>
                        <span className="text-xl font-bold text-green-600">
                          {formatearMoneda(evento.acumulado_actual)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Límite por predicción:</span>
                        <span className="font-medium">{formatearMoneda(evento.limite_prediccion)}</span>
                      </div>
                      <div className="flex gap-2 text-xs text-gray-500">
                        <span className="bg-blue-50 px-2 py-1 rounded">Casa: {evento.porcentaje_casa}%</span>
                        <span className="bg-blue-50 px-2 py-1 rounded">Pozo: {evento.porcentaje_pozo}%</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      asChild
                      disabled={evento.estado !== "ACTIVO"}
                    >
                      <Link href={`/eventos/${evento.id}`}>
                        {evento.estado === "ACTIVO" ? "Comprar Gurú" : "Evento cerrado"}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>1. Regístrate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Crea tu cuenta gratis y recibe créditos de bienvenida
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>2. Compra Gurús</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Elige eventos y compra Gurús para predecir resultados (2 créditos c/u)
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>3. Gana</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Acierta y multiplica tus créditos. Retira cuando quieras
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 Gurú. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}