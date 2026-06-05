// app/(public)/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Eye, EyeOff, Mail, Lock, User, Globe, Flame, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    pais: "CO",
    moneda: "COP"
  });

  const paises = [
    { codigo: "CO", nombre: "Colombia", bandera: "🇨🇴" },
    { codigo: "AR", nombre: "Argentina", bandera: "🇦🇷" },
    { codigo: "BR", nombre: "Brasil", bandera: "🇧🇷" },
    { codigo: "MX", nombre: "México", bandera: "🇲🇽" },
    { codigo: "CL", nombre: "Chile", bandera: "🇨🇱" },
    { codigo: "PE", nombre: "Perú", bandera: "🇵🇪" },
    { codigo: "UY", nombre: "Uruguay", bandera: "🇺🇾" },
    { codigo: "PY", nombre: "Paraguay", bandera: "🇵🇾" },
    { codigo: "EC", nombre: "Ecuador", bandera: "🇪🇨" },
    { codigo: "VE", nombre: "Venezuela", bandera: "🇻🇪" },
    { codigo: "US", nombre: "Estados Unidos", bandera: "🇺🇸" },
    { codigo: "ES", nombre: "España", bandera: "🇪🇸" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Aquí irá la llamada a tu API de registro
      // const response = await api.post("/auth/register", formData);
      
      // Simulación de registro exitoso
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirigir al login
      router.push("/login?registered=true");
    } catch (error) {
      console.error("Error en registro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Fondo estilo lobby (como landing) */}
      <div className="fixed inset-0 w-full h-full bg-[url('/img/lobby.jpg')] bg-cover bg-center opacity-40 z-[-2]" />
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-[-1]" />
      
      {/* Grid decorativo */}
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[linear-gradient(rgba(141,198,63,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(141,198,63,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Card con efecto glassmorphism y borde animado */}
      <div className="relative w-full max-w-md">
        {/* Borde animado */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 rounded-2xl blur opacity-30 animate-pulse" />
        
        <Card className="relative bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
          <CardHeader className="space-y-2 text-center pb-8">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Flame className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              KICKLAST
            </CardTitle>
            <CardDescription className="text-gray-400">
              Únete a la comunidad de ganadores
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-sm font-medium text-gray-300">
                  Nombre completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="nombre"
                    placeholder="Ej: Juan Pérez"
                    className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500/20 rounded-lg"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@email.com"
                    className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500/20 rounded-lg"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500/20 rounded-lg"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-green-400 transition"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 8 caracteres, incluye números y letras
                </p>
              </div>

              {/* País */}
              <div className="space-y-2">
                <Label htmlFor="pais" className="text-sm font-medium text-gray-300">
                  País
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <select
                    id="pais"
                    className="flex h-12 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 pl-10 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.pais}
                    onChange={(e) => setFormData({...formData, pais: e.target.value})}
                  >
                    {paises.map((pais) => (
                      <option key={pais.codigo} value={pais.codigo} className="bg-black">
                        {pais.bandera} {pais.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Términos y condiciones */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="terminos"
                  className="w-4 h-4 text-green-500 rounded border-white/20 bg-white/5 focus:ring-green-500 focus:ring-offset-0"
                  required
                />
                <Label htmlFor="terminos" className="text-sm text-gray-400">
                  Acepto los{" "}
                  <Link href="/terminos" className="text-green-400 hover:text-green-300 transition">
                    Términos y Condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link href="/privacidad" className="text-green-400 hover:text-green-300 transition">
                    Política de Privacidad
                  </Link>
                </Label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-4">
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creando cuenta...</span>
                  </div>
                ) : (
                  "Crear cuenta gratis"
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black/80 px-2 text-gray-500">O continúa con</span>
                </div>
              </div>

              <Button variant="outline" className="w-full h-12 rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-green-500 transition-all duration-300" type="button">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar con Google
              </Button>

              <p className="text-center text-sm text-gray-500">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="text-green-400 font-semibold hover:text-green-300 transition">
                  Inicia sesión
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}