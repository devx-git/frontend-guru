// app/(public)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { setAuth, isLoading, setLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const data = await authService.login(formData);
    
    // Verificar que data y data.user existan
    if (!data || !data.access_token) {
      throw new Error("Respuesta inválida del servidor");
    }
    
    setAuth(data.access_token, data.user);
    
    // Redirigir según el rol (con validación segura)
    window.location.href = "/dashboard";
  } catch (err: any) {
    console.error("Error en login:", err);
    setError(err.response?.data?.message || err.message || "Error al iniciar sesión. Verifica tus credenciales.");
  } finally {
    setLoading(false);
  }
};

  // Datos de prueba para desarrollo rápido
  const fillTestUser = () => {
    setFormData({
      email: "cliente1@guru.com",
      password: "123456",
    });
  };

  const fillAdminUser = () => {
    setFormData({
      email: "admin@guru.com",
      password: "123456",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="space-y-2 text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Bienvenido de vuelta</CardTitle>
          <CardDescription className="text-gray-500">
            Ingresa a tu cuenta para continuar
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@email.com"
                  className="pl-10 h-12"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

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
            </div>

            {/* Botones de prueba rápida */}
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs"
                onClick={fillTestUser}
              >
                Usuario prueba
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs"
                onClick={fillAdminUser}
              >
                Admin prueba
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Recordarme
                </Label>
              </div>
              <Link href="/recuperar-password" className="text-sm text-blue-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                "Iniciar sesión"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">O continúa con</span>
              </div>
            </div>

            <Button variant="outline" className="w-full h-12" type="button">
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

            <p className="text-center text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="text-blue-600 font-semibold hover:underline">
                Regístrate gratis
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}