"use client";

import Link from "next/link";
import { CheckCircle, Building2, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PromotorRegistroExitoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-0 shadow-lg text-center">
        <CardHeader>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">¡Registro exitoso!</CardTitle>
          <CardDescription>
            Tu cuenta de promotor ha sido creada correctamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">Bienvenido a la red de promotores</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">
                Te hemos enviado un correo con los siguientes pasos
              </span>
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-xl p-4 text-left">
            <p className="text-sm font-medium text-amber-800 mb-2">¿Qué sigue?</p>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Revisa tu correo para confirmar tu cuenta</li>
              <li>• Configura tu subdominio personalizado</li>
              <li>• Comienza a crear tus primeros eventos</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-green-600"
            asChild
          >
            <Link href="/login">
              Ir al inicio de sesión
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}