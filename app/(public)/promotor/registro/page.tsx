"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Eye, EyeOff, Mail, Lock, User, Globe, Building2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

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

    // Validar subdominio
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
      // Registrar como promotor
      const response = await api.post("/auth/register/promotor", {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        pais: formData.pais,
        subdominio: formData.subdominio.toLowerCase().replace(/\s+/g, "-"),
        acepta_terminos: formData.acepta_terminos,
      });

      if (response.data.success) {
        // Redirigir a página de éxito
        router.push("/promotor/registro/exito");
      }
    } catch (err: any) {
      console.error("Error en registro de promotor:", err);
      setError(err.response?.data?.message || "Error al registrar como promotor. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="space-y-2 text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Registro de Promotor</CardTitle>
          <CardDescription className="text-gray-500">
            Únete a nuestra red de promotores y crea tus propios eventos
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-sm font-medium">
                Nombre del promotor
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="nombre"
                  placeholder="Ej: Deportes Colombia SAS"
                  className="pl-10 h-12"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="contacto@promotor.com"
                  className="pl-10 h-12"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
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
              <Label htmlFor="pais" className="text-sm font-medium">
                País
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  id="pais"
                  className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.pais}
                  onChange={(e) => setFormData({...formData, pais: e.target.value})}
                >
                  {paises.map((pais) => (
                    <option key={pais.codigo} value={pais.codigo}>
                      {pais.bandera} {pais.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subdominio */}
            <div className="space-y-2">
              <Label htmlFor="subdominio" className="text-sm font-medium">
                Subdominio
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="subdominio"
                  placeholder="ejemplo"
                  className="pl-10 h-12"
                  value={formData.subdominio}
                  onChange={(e) => setFormData({...formData, subdominio: e.target.value})}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Tu espacio único: https://<span className="font-mono">{formData.subdominio || "tusitio"}</span>.guru.com
              </p>
            </div>

            {/* Términos y condiciones */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="terminos"
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                checked={formData.acepta_terminos}
                onChange={(e) => setFormData({...formData, acepta_terminos: e.target.checked})}
                required
              />
              <Label htmlFor="terminos" className="text-sm text-gray-600">
                Acepto los{" "}
                <Link href="/terminos" className="text-blue-600 hover:underline">
                  Términos y Condiciones
                </Link>{" "}
                y la{" "}
                <Link href="/privacidad" className="text-blue-600 hover:underline">
                  Política de Privacidad
                </Link>{" "}
                para promotores
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
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

            <p className="text-center text-sm text-gray-600">
              ¿Ya tienes una cuenta de promotor?{" "}
              <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                Inicia sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}