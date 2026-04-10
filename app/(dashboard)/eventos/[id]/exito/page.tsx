"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Trophy, Mail, ArrowRight, Coins } from "lucide-react";
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
    // Simular envío de email
    console.log(`📧 Email enviado: Confirmación de ${cantidadGurus} Gurú(s)`);
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="max-w-md w-full border-0 shadow-lg text-center">
        <CardHeader>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">¡Gurú comprado!</CardTitle>
          <CardDescription>
            Tu predicción ha sido registrada exitosamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="font-semibold">{cantidadGurus} Gurú(s) comprados</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Coins className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">
                Se descontaron {creditosDescontados} créditos
              </span>
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-amber-600" />
              <span className="font-medium text-sm">Correo enviado</span>
            </div>
            <p className="text-xs text-amber-700">
              Revisa tu bandeja de entrada para confirmar tu predicción
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-green-600"
            onClick={() => router.push("/dashboard")}
          >
            Ir al Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push(`/eventos/${eventoId}`)}
          >
            Ver otros eventos
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}