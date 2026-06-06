"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User, Globe, Building2, AlertCircle, Flame } from "lucide-react";

export default function PromotorRegistroPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    pais: "CO",
    subdominio: "",
    acepta_terminos: false,
  });

  const paises = [
    { codigo: "CO", nombre: "Colombia", bandera: "🇨🇴" },
    { codigo: "EC", nombre: "Ecuador", bandera: "🇪🇨" },
    { codigo: "AR", nombre: "Argentina", bandera: "🇦🇷" },
    { codigo: "BR", nombre: "Brasil", bandera: "🇧🇷" },
    { codigo: "MX", nombre: "México", bandera: "🇲🇽" },
    { codigo: "CL", nombre: "Chile", bandera: "🇨🇱" },
    { codigo: "PE", nombre: "Perú", bandera: "🇵🇪" },
    { codigo: "UY", nombre: "Uruguay", bandera: "🇺🇾" },
    { codigo: "ES", nombre: "España", bandera: "🇪🇸" },
    { codigo: "US", nombre: "Estados Unidos", bandera: "🇺🇸" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.subdominio) {
      setError("El subdominio es requerido");
      setLoading(false);
      return;
    }

    if (!formData.acepta_terminos) {
      setError("Debes aceptar los términos y condiciones para ser promotor");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://api.devxsolutions.pro/auth/registro-promotor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password,
          pais: formData.pais,
          subdominio: formData.subdominio.toLowerCase().replace(/\s+/g, "-"),
          acepta_terminos: formData.acepta_terminos
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrar como promotor");
      }

      router.push("/login?registered=promotor");
    } catch (err: any) {
      console.error("Error en registro de promotor:", err);
      setError(err.message || "Error al registrar como promotor. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Fondo lobby */}
      <div className="fixed inset-0 w-full h-full bg-[url('/img/lobby.jpg')] bg-cover bg-center opacity-30 z-[-2]" />
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-[-1]" />
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[linear-gradient(rgba(141,198,63,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(141,198,63,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Card con borde animado */}
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 rounded-2xl blur opacity-30 animate-pulse" />
        
        <Card className="relative bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
          <CardHeader className="space-y-2 text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              KICKLAST
            </CardTitle>
            <CardDescription className="text-gray-400">
              Registro de Promotor
            </CardDescription>
            <CardDescription className="text-gray-500 text-sm">
              Únete a nuestra red de promotores y crea tus propios eventos
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-sm font-medium text-gray-300">
                  Nombre del promotor
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="nombre"
                    placeholder="Ej: Deportes Colombia SAS"
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
                    placeholder="contacto@promotor.com"
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
                    className="flex h-12 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 pl-10 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

              {/* Subdominio */}
              <div className="space-y-2">
                <Label htmlFor="subdominio" className="text-sm font-medium text-gray-300">
                  Subdominio
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="subdominio"
                    placeholder="ejemplo"
                    className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500/20 rounded-lg"
                    value={formData.subdominio}
                    onChange={(e) => setFormData({...formData, subdominio: e.target.value})}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Tu espacio único: https://<span className="font-mono text-green-400">{formData.subdominio || "tusitio"}</span>.kicklast.com
                </p>
              </div>

              {/* Términos y condiciones */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="terminos"
                  className="w-4 h-4 text-green-500 rounded border-white/20 bg-white/5 focus:ring-green-500 focus:ring-offset-0"
                  checked={formData.acepta_terminos}
                  onChange={(e) => setFormData({...formData, acepta_terminos: e.target.checked})}
                  required
                />
                <Label htmlFor="terminos" className="text-sm text-gray-400 cursor-pointer">
                  Acepto los{" "}
                  <Link href="/terminos" className="text-green-400 hover:text-green-300 transition">
                    Términos y Condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link href="/privacidad" className="text-green-400 hover:text-green-300 transition">
                    Política de Privacidad
                  </Link>{" "}
                  para promotores
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
                    <span>Registrando...</span>
                  </div>
                ) : (
                  "Registrarse como Promotor"
                )}
              </Button>

              <p className="text-center text-sm text-gray-500">
                ¿Ya tienes una cuenta de promotor?{" "}
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