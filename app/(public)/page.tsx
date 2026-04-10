"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getEventosActivos, Evento } from "@/services/eventos.service";
import Link from "next/link";
import { VideoHero } from "@/components/ui/VideoHero";
import Image from "next/image";
import { 
  CalendarDays, 
  Trophy, 
  Users, 
  TrendingUp, 
  Lock, 
  Sparkles,
  Star,
  ArrowRight,
  Play,
  ChevronRight,
  Crown,
  Shield,
  Zap,
  Award,
  Globe,
  Target
} from "lucide-react";

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

  // Planes de membresía
  const planes = [
    {
      nombre: "Básica",
      precio: "Gratis",
      periodo: "siempre",
      icon: Users,
      color: "from-gray-500 to-gray-600",
      features: [
        "Acceso a eventos públicos",
        "1 Gurú por evento",
        "Soporte básico",
        "Estadísticas básicas"
      ],
      popular: false
    },
    {
      nombre: "Premium",
      precio: "$50,000",
      periodo: "mensual",
      icon: Crown,
      color: "from-amber-500 to-orange-500",
      features: [
        "Todo lo de Básica",
        "Eventos VIP",
        "5 Gurús por evento",
        "Soporte prioritario",
        "Estadísticas avanzadas",
        "Sin publicidad"
      ],
      popular: true
    },
    {
      nombre: "VIP",
      precio: "$150,000",
      periodo: "mensual",
      icon: Shield,
      color: "from-purple-500 to-pink-500",
      features: [
        "Todo lo de Premium",
        "Eventos exclusivos",
        "Gurús ilimitados",
        "Asesoría personalizada",
        "Retiros prioritarios",
        "Cashback del 10%"
      ],
      popular: false
    }
  ];

  // Testimonios
  const testimonios = [
    {
      nombre: "Carlos Pérez",
      rol: "Usuario Premium",
      comentario: "La mejor plataforma para predicciones deportivas. He ganado más de $500 en mi primer mes.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      nombre: "Laura Gómez",
      rol: "Promotora",
      comentario: "Excelente herramienta para monetizar mi conocimiento deportivo. Totalmente recomendada.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      nombre: "Mateo Rodríguez",
      rol: "Usuario VIP",
      comentario: "Los eventos VIP son increíbles. Los premios son muy altos y la comunidad es genial.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    }
  ];

  // Campeonatos destacados (mock para fase inicial)
  const campeonatos = [
    { nombre: "Mundial 2026", logo: "🌍", pais: "Global", equipos: 32 },
    { nombre: "Champions League", logo: "🏆", pais: "Europa", equipos: 32 },
    { nombre: "LaLiga", logo: "🇪🇸", pais: "España", equipos: 20 },
    { nombre: "Premier League", logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", pais: "Inglaterra", equipos: 20 },
    { nombre: "Serie A", logo: "🇮🇹", pais: "Italia", equipos: 20 },
    { nombre: "Bundesliga", logo: "🇩🇪", pais: "Alemania", equipos: 18 },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header con Logo */}
      <header className="border-b sticky top-0 bg-white/95 backdrop-blur-md z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Gurú
            </h1>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#eventos" className="text-gray-600 hover:text-blue-600 transition">Eventos</Link>
            <Link href="#campeonatos" className="text-gray-600 hover:text-blue-600 transition">Campeonatos</Link>
            <Link href="#planes" className="text-gray-600 hover:text-blue-600 transition">Planes</Link>
            <Link href="#promotores" className="text-gray-600 hover:text-blue-600 transition">Para Promotores</Link>
          </nav>
          
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section con Video Background */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-green-900/90 z-10"></div>
          <VideoHero
            autoPlay={true}
            loop={true}
            muted={true}
            controls={true}
            posterSrc="/videos/guru-poster.jpg"
            className="w-full h-full"
            videoSrc="/videos/guru-presentacion.mp4"
            >
          </VideoHero>
        </div>
          {/* Contenido del Hero */}     
        <div className="container mx-auto px-4 relative z-20 text-white">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">Plataforma #1 en predicciones deportivas</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Gana con tu
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {" "}conocimiento deportivo
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Compra Gurús, predice resultados y multiplica tus créditos. Únete a más de 50,000 usuarios que ya están ganando.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-xl" asChild>
                <Link href="/register">Comenzar ahora <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20" asChild>
                <Link href="#eventos">Ver eventos <Play className="ml-2 w-5 h-5" /></Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce hidden md:block">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-800">+50K</div>
              <div className="text-gray-500">Usuarios activos</div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-800">+$2M</div>
              <div className="text-gray-500">En premios</div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-800">98%</div>
              <div className="text-gray-500">Satisfacción</div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <CalendarDays className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-800">500+</div>
              <div className="text-gray-500">Eventos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Eventos Disponibles (MANTENIDO) */}
      <section id="eventos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Eventos disponibles 🔥</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Compra Gurús en los eventos activos y comienza a ganar
            </p>
          </div>

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
                <Card key={evento.id} className="hover:shadow-xl transition-all hover:-translate-y-1 border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{evento.nombre}</CardTitle>
                      {getTipoEventoBadge(evento.tipo_evento || "PUBLICO")}
                    </div>
                    <CardDescription>
                      {evento.fecha_inicio ? new Date(evento.fecha_inicio).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long"
                      }) : "Próximamente"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Acumulado:</span>
                        <span className="text-xl font-bold text-green-600">
                          {formatearMoneda(evento.acumulado_actual || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Límite por predicción:</span>
                        <span className="font-medium">{formatearMoneda(evento.limite_prediccion || 500000)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700" asChild>
                      <Link href={`/eventos/${evento.id}`}>
                        Ver detalles <ChevronRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Campeonatos Destacados */}
      <section id="campeonatos" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Campeonatos destacados 🏆</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Sigue los torneos más importantes y sus tablas de posiciones
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {campeonatos.map((campeonato, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-white border rounded-xl p-4 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{campeonato.logo}</div>
                  <h3 className="font-semibold text-sm">{campeonato.nombre}</h3>
                  <p className="text-xs text-gray-500 mt-1">{campeonato.pais}</p>
                  <p className="text-xs text-blue-600 mt-2">{campeonato.equipos} equipos</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/campeonatos">Ver todos los campeonatos <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Planes de Membresía */}
      <section id="planes" className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Elige tu plan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Desbloquea beneficios exclusivos y maximiza tus ganancias
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {planes.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <Card key={index} className={`relative border-0 shadow-xl ${plan.popular ? 'ring-2 ring-amber-500 scale-105' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Más popular
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{plan.nombre}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">{plan.precio}</span>
                      {plan.precio !== "Gratis" && <span className="text-gray-500">/{plan.periodo}</span>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className={`w-full ${plan.popular ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gray-800'}`} asChild>
                      <Link href={plan.precio === "Gratis" ? "/register" : "/membresias"}>
                        {plan.precio === "Gratis" ? "Comenzar gratis" : "Suscribirse"}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Lo que dicen nuestros usuarios</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Miles de usuarios ya confían en Gurú para sus predicciones deportivas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonios.map((testimonio, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-green-500 p-0.5">
                      <img src={testimonio.avatar} alt={testimonio.nombre} className="w-full h-full rounded-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonio.nombre}</h4>
                      <p className="text-sm text-gray-500">{testimonio.rol}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonio.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">"{testimonio.comentario}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Para Promotores */}
      <section id="promotores" className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">¿Quieres ser promotor?</h2>
            <p className="text-white/90 text-lg mb-8">
              Crea tus propios eventos, gestiona campeonatos y gana comisiones. Únete a nuestra red de promotores.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                <Link href="/promotor/registro">Inscribirse como promotor</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white/20" asChild>
                <Link href="/promotor/info">Más información</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para comenzar a ganar?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Únete hoy y recibe 100 créditos de bienvenida para empezar a predecir
          </p>
          <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700" asChild>
            <Link href="/register">Regístrate gratis <ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg">Gurú</h3>
              </div>
              <p className="text-sm">La plataforma líder en predicciones deportivas en Latinoamérica.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Enlaces rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#eventos" className="hover:text-white transition">Eventos</Link></li>
                <li><Link href="#campeonatos" className="hover:text-white transition">Campeonatos</Link></li>
                <li><Link href="#planes" className="hover:text-white transition">Planes</Link></li>
                <li><Link href="#promotores" className="hover:text-white transition">Para Promotores</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terminos" className="hover:text-white transition">Términos y condiciones</Link></li>
                <li><Link href="/privacidad" className="hover:text-white transition">Política de privacidad</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition">Política de cookies</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li>📧 soporte@guru.com</li>
                <li>📞 +57 300 123 4567</li>
                <li>🌐 www.guru.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Gurú. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Función para obtener badge según tipo de evento
function getTipoEventoBadge(tipo: string) {
  switch(tipo) {
    case "VIP":
      return <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center"><Sparkles className="w-3 h-3 mr-1" />VIP</span>;
    case "PRIVADO":
      return <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full flex items-center"><Lock className="w-3 h-3 mr-1" />Privado</span>;
    default:
      return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Público</span>;
  }
}

// Componente Check (agregar al inicio con los imports)
function Check({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}