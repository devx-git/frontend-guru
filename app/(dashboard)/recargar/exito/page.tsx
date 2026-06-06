"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Coins, ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecargaExitoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const creditos = searchParams.get("creditos") || "0";
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

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
              ¡Recarga exitosa!
            </CardTitle>
            <CardDescription className="text-gray-400">
              Tus créditos han sido acreditados correctamente
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="bg-white/5 rounded-xl p-6 border border-green-500/30">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Coins className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Créditos agregados</p>
                  <p className="text-3xl font-bold text-green-400">
                    {parseInt(creditos).toLocaleString()} créditos
                  </p>
                </div>
              </div>
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
            <p className="text-xs text-gray-500">
              Redirigiendo automáticamente en <span className="text-green-400 font-semibold">{countdown}</span> segundos...
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}