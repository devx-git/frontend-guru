"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Trophy, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PagoExitoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventoId = searchParams.get("evento");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(`/eventos/${eventoId}/prediccion`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, eventoId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="max-w-md w-full border-0 shadow-lg text-center">
        <CardHeader>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">¡Pago exitoso!</CardTitle>
          <CardDescription>
            Tus créditos han sido acreditados correctamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-green-600" />
              <span className="font-semibold">+2 créditos</span>
            </div>
            <p className="text-sm text-gray-600">
              Ya puedes comprar tu Gurú
            </p>
          </div>
          
          <div className="bg-amber-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-amber-600" />
              <span className="font-medium text-sm">Revisa tu correo</span>
            </div>
            <p className="text-xs text-amber-700">
              Te hemos enviado un comprobante de pago
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-green-600"
            onClick={() => router.push(`/eventos/${eventoId}/prediccion`)}
          >
            Continuar con la predicción
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-xs text-gray-400">
            Redirigiendo automáticamente en {countdown} segundos...
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}