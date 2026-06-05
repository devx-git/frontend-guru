"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getEventosActivos, Evento } from "@/services/eventos.service";
import Link from "next/link";
import { 
  Trophy, 
  Users, 
  Lock, 
  Sparkles,
  Star,
  ArrowRight,
  ChevronRight,
  Crown,
  Shield,
  Globe,
  CheckCircle,
  Flame,
  Target,
  Zap,
  Award,
  TrendingUp,
  Calendar
} from "lucide-react";

// ========== CARRUSEL DE IMÁGENES ==========
const carruselImages = [
  { id: 1, src: "/images/carrusel/11chica.png", title: "Copa Libertadores 2024", color: "from-blue-600 to-green-600" },
  { id: 2, src: "/images/carrusel/james2.jpg", title: "La Liga EA Sports", color: "from-amber-500 to-red-500" },
  { id: 3, src: "/images/carrusel/guerra1.png", title: "Premier League", color: "from-purple-600 to-pink-500" },
];

export default function HomePage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // Auto-rotate carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carruselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  };

  const planes = [
    { nombre: "Básica", precio: "Gratis", periodo: "siempre", icon: Users, color: "from-gray-500 to-gray-600", features: ["Acceso a eventos públicos", "1 Gurú por evento", "Soporte básico"], popular: false },
    { nombre: "Premium", precio: "$50,000", periodo: "mensual", icon: Crown, color: "from-amber-500 to-orange-500", features: ["Eventos VIP", "5 Gurús por evento", "Soporte prioritario", "Estadísticas avanzadas"], popular: true },
    { nombre: "VIP", precio: "$150,000", periodo: "mensual", icon: Shield, color: "from-purple-500 to-pink-500", features: ["Eventos exclusivos", "Gurús ilimitados", "Asesoría personalizada", "Cashback del 10%"], popular: false }
  ];

  const testimonios = [
    { nombre: "Carlos Pérez", rol: "Usuario Premium", comentario: "La mejor plataforma para predicciones deportivas. He ganado más de $500 en mi primer mes.", rating: 5, avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
    { nombre: "Laura Gómez", rol: "Promotora", comentario: "Excelente herramienta para monetizar mi conocimiento deportivo.", rating: 5, avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
    { nombre: "Mateo Rodríguez", rol: "Usuario VIP", comentario: "Los eventos VIP son increíbles. Los premios son muy altos.", rating: 5, avatar: "https://randomuser.me/api/portraits/men/3.jpg" }
  ];

  const campeonatos = [
    { nombre: "Mundial 2026", logo: "🌍", pais: "Global", equipos: 32 },
    { nombre: "Champions League", logo: "🏆", pais: "Europa", equipos: 32 },
    { nombre: "LaLiga", logo: "🇪🇸", pais: "España", equipos: 20 },
    { nombre: "Premier League", logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", pais: "Inglaterra", equipos: 20 },
    { nombre: "Serie A", logo: "🇮🇹", pais: "Italia", equipos: 20 },
    { nombre: "Bundesliga", logo: "🇩🇪", pais: "Alemania", equipos: 18 },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Fondo lobby estilo juego */}
      <div className="fixed inset-0 w-full h-full bg-[url('/img/lobby.jpg')] bg-cover bg-center opacity-40 z-[-2]" />
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-[-1]" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              KICKLAST
            </h1>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#eventos" className="text-gray-300 hover:text-blue-400 transition">Eventos</Link>
            <Link href="#campeonatos" className="text-gray-300 hover:text-blue-400 transition">Campeonatos</Link>
            <Link href="#planes" className="text-gray-300 hover:text-blue-400 transition">Planes</Link>
            <Link href="#promotores" className="text-gray-300 hover:text-blue-400 transition">Promotores</Link>
          </nav>
          <div className="flex gap-2">
            <Button variant="ghost" asChild className="text-white hover:bg-white/10">
              <Link href="/login">Ingresar</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ========== HERO CON CARRUSEL ========== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {carruselImages.map((img, idx) => (
            <div key={img.id} className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
              <div className={`relative w-full h-full bg-gradient-to-r ${img.color}`}>
                <img src={img.src} alt={img.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50" />
              </div>
            </div>
          ))}
        </div>
        <div className="container mx-auto px-4 relative z-20 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Flame className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">Plataforma #1 en predicciones</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Gana con tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">conocimiento deportivo</span>
            </h1>
            <p className="text-xl text-white/80 mb-8">Compra Gurús, predice resultados y multiplica tus créditos.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8 rounded-full" asChild>
                <Link href="/register">Comenzar ahora <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full" asChild>
                <Link href="#eventos">Ver eventos</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
          {carruselImages.map((_, idx) => (
            <button key={idx} className={`transition-all duration-300 ${idx === currentSlide ? "w-8 h-2 bg-white rounded-full" : "w-2 h-2 bg-white/50 rounded-full"}`} onClick={() => setCurrentSlide(idx)} />
          ))}
        </div>
      </section>

      {/* ========== BANNER PREMIUM ========== */}
      <div className="w-full py-16 text-center relative overflow-hidden border-y border-red-500/20 bg-gradient-to-b from-blue-950/30 to-black/80">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[scanLight_6s_linear_infinite]" />
        <div className="relative z-10">
          <div className="w-32 h-px mx-auto mb-4 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
          <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-wider">
            EL CAMPO DE BATALLA <span className="text-red-500">TE ESPERA</span>
          </h2>
          <div className="w-32 h-px mx-auto mt-4 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
        </div>
      </div>

      {/* ========== ESTADÍSTICAS ========== */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><div className="text-4xl font-bold text-blue-400">+50K</div><div className="text-gray-400">Usuarios activos</div></div>
            <div><div className="text-4xl font-bold text-green-400">+$2M</div><div className="text-gray-400">En premios</div></div>
            <div><div className="text-4xl font-bold text-yellow-400">98%</div><div className="text-gray-400">Satisfacción</div></div>
            <div><div className="text-4xl font-bold text-purple-400">500+</div><div className="text-gray-400">Eventos</div></div>
          </div>
        </div>
      </section>

      {/* ========== EVENTOS ========== */}
      <section id="eventos" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Eventos disponibles 🔥</h2>
          <p className="text-gray-400 text-center mb-12">Compra Gurús y comienza a ganar</p>
          {loading ? (
            <div className="text-center py-12">Cargando...</div>
          ) : eventos.length === 0 ? (
            <div className="text-center py-12">No hay eventos disponibles</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventos.map((evento) => (
                <Card key={evento.id} className="bg-black/60 border border-white/10 backdrop-blur-sm hover:border-blue-500/50 transition-all">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white">{evento.nombre}</CardTitle>
                      {getTipoEventoBadge(evento.tipo_evento || "PUBLICO")}
                    </div>
                    <CardDescription className="text-gray-400">{new Date(evento.fecha_inicio).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center p-3 bg-blue-950/30 rounded-lg">
                      <span className="text-gray-300">Acumulado:</span>
                      <span className="text-xl font-bold text-green-400">{formatearMoneda(evento.acumulado_actual || 0)}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 rounded-full" asChild>
                      <Link href={`/eventos/${evento.id}`}>Ver detalles <ChevronRight className="ml-2 w-4 h-4" /></Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========== CAMPEONATOS DESTACADOS ========== */}
      <section id="campeonatos" className="py-20 px-4 bg-gradient-to-b from-black/80 to-blue-950/20">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Campeonatos destacados 🏆</h2>
          <p className="text-gray-400 text-center mb-12">Sigue los torneos más importantes</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {campeonatos.map((campeonato, idx) => (
              <div key={idx} className="bg-black/50 border border-white/10 rounded-xl p-4 text-center hover:border-blue-500/50 transition-all">
                <div className="text-4xl mb-2">{campeonato.logo}</div>
                <h3 className="font-semibold text-sm">{campeonato.nombre}</h3>
                <p className="text-xs text-gray-500">{campeonato.pais}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== MANUAL DEL JUEGO ========== */}
      <div className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wider">¿CÓMO FUNCIONA?</h2>
            <span className="text-sm tracking-[7px] text-blue-400">KICKLAST SYSTEM</span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "ELIGE EVENTO", desc: "Selecciona entre los mejores eventos deportivos del momento.", highlight: "Mundial, Champions, Ligas" },
              { step: "02", title: "COMPRA GURÚ", desc: "Adquiere predicciones automáticas por solo 2 créditos.", highlight: "+50K predicciones activas" },
              { step: "03", title: "GANA CRÉDITOS", desc: "Acierta y gana parte del pozo acumulado.", highlight: "Hasta 80% del pozo" }
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-black/50 border border-white/10 hover:border-blue-500/50 transition-all">
                <div className="text-blue-400 text-sm font-bold tracking-wider mb-3">{item.step}</div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 mb-3">{item.desc}</p>
                <div className="text-green-400 text-sm font-semibold">{item.highlight}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== PLANES ========== */}
      <section id="planes" className="py-20 px-4 bg-gradient-to-b from-black/80 to-blue-950/20">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Elige tu plan</h2>
          <p className="text-gray-400 text-center mb-12">Desbloquea beneficios exclusivos</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {planes.map((plan, idx) => {
              const Icon = plan.icon;
              return (
                <Card key={idx} className={`bg-black/60 border ${plan.popular ? 'border-amber-500/50' : 'border-white/10'} backdrop-blur-sm transition-all ${plan.popular ? 'scale-105' : ''}`}>
                  {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-3 py-1 rounded-full text-sm font-bold">MÁS POPULAR</div>}
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center`}><Icon className="w-8 h-8 text-white" /></div>
                    <CardTitle className="text-2xl text-white">{plan.nombre}</CardTitle>
                    <div className="text-3xl font-bold text-white mt-2">{plan.precio}</div>
                  </CardHeader>
                  <CardContent><ul className="space-y-2">{plan.features.map((f, i) => (<li key={i} className="flex items-center gap-2 text-gray-300"><CheckCircle className="w-4 h-4 text-green-500" />{f}</li>))}</ul></CardContent>
                  <CardFooter><Button className={`w-full rounded-full ${plan.popular ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-white/10 hover:bg-white/20'}`} asChild><Link href={plan.precio === "Gratis" ? "/register" : "/membresias"}>{plan.precio === "Gratis" ? "Comenzar gratis" : "Suscribirse"}</Link></Button></CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIOS ========== */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Lo que dicen nuestros usuarios</h2>
          <p className="text-gray-400 text-center mb-12">Miles de usuarios ya confían en KICKLAST</p>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonios.map((testimonio, idx) => (
              <Card key={idx} className="bg-black/60 border border-white/10 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold">{testimonio.nombre[0]}</div>
                    <div><h4 className="font-bold">{testimonio.nombre}</h4><p className="text-sm text-gray-400">{testimonio.rol}</p></div>
                  </div>
                  <div className="flex gap-1 mb-3">{[...Array(testimonio.rating)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />))}</div>
                  <p className="text-gray-300 italic">"{testimonio.comentario}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PARA PROMOTORES ========== */}
      <section id="promotores" className="py-20 px-4 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto text-center">
          <Globe className="w-16 h-16 mx-auto mb-4 text-white/80" />
          <h2 className="text-4xl font-bold text-white mb-4">¿Quieres ser promotor?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">Crea tus propios eventos, gestiona campeonatos y gana comisiones.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="rounded-full" asChild><Link href="/promotor/registro">Inscribirse como promotor</Link></Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 rounded-full" asChild><Link href="/promotor/info">Más información</Link></Button>
          </div>
        </div>
      </section>

      {/* ========== CTA FINAL ========== */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">¿Listo para comenzar a ganar?</h2>
        <p className="text-gray-400 mb-8">Únete hoy y recibe 100 créditos de bienvenida</p>
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 rounded-full text-lg px-8" asChild><Link href="/register">Regístrate gratis <ArrowRight className="ml-2 w-5 h-5" /></Link></Button>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-white/10 py-12 px-4 text-center text-gray-500 text-sm">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-green-500" />
              <span className="font-bold text-white">KICKLAST</span>
            </div>
            <div className="flex gap-6">
              <Link href="/terminos" className="hover:text-white transition">Términos</Link>
              <Link href="/privacidad" className="hover:text-white transition">Privacidad</Link>
              <Link href="/contacto" className="hover:text-white transition">Contacto</Link>
            </div>
            <div className="text-sm">📧 soporte@kicklast.com</div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10">
            <p>&copy; {new Date().getFullYear()} KICKLAST. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function getTipoEventoBadge(tipo: string) {
  switch(tipo) {
    case "VIP": return <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"><Sparkles className="w-3 h-3" />VIP</span>;
    case "PRIVADO": return <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"><Lock className="w-3 h-3" />Privado</span>;
    default: return <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full">Público</span>;
  }
}