"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Trophy, Mail, ArrowRight, Coins, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrediccionExitoPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventoId = params.id as string;
  const cantidadGurus = searchParams.get("cantidad") || "1";
  const creditosDescontados = searchParams.get("creditos") || (parseInt(cantidadGurus) * 2).toString();

  useEffect(() => {
    console.log(`📧 Email enviado: Confirmación de ${cantidadGurus} Gurú(s)`);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Fondo lobby */}
      <div className="fixed inset-0 w-full h-full bg-[url('/img/lobby.jpg')] bg-cover bg-center opacity-30 z-[-2]" />
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-[-1]" />
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[linear-gradient(rgba(141,198,63,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(141,198,63,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Card con borde animado */}
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-blue-500 to-green-500 rounded-2xl blur opacity-30 animate-pulse" />
        
        <Card className="relative bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              ¡Gurú comprado!
            </CardTitle>
            <CardDescription className="text-gray-400">
              Tu predicción ha sido registrada exitosamente
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Resumen de compra */}
            <div className="bg-white/5 rounded-xl p-4 border border-green-500/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-amber-400" />
                </div>
                <span className="font-semibold text-white">{cantidadGurus} Gurú(s) comprados</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Coins className="w-3 h-3 text-green-400" />
                </div>
                <span className="text-sm text-gray-400">
                  Se descontaron {creditosDescontados} créditos
                </span>
              </div>
            </div>
            
            {/* Correo */}
            <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span className="font-medium text-sm text-amber-400">Correo enviado</span>
              </div>
              <p className="text-xs text-amber-400/70">
                Revisa tu bandeja de entrada para confirmar tu predicción
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-3">
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-full py-5 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => router.push("/dashboard")}
            >
              Ir al Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full border-white/20 text-white hover:bg-white/10 hover:border-green-500 transition-all duration-300"
              onClick={() => router.push(`/eventos/${eventoId}`)}
            >
              Ver otros eventos
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}