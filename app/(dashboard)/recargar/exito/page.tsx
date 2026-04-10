"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Coins, ArrowRight } from "lucide-react";
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
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="max-w-md w-full border-0 shadow-lg text-center">
        <CardHeader>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">¡Recarga exitosa!</CardTitle>
          <CardDescription>
            Tus créditos han sido acreditados correctamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
            <div className="flex items-center justify-center gap-3">
              <Coins className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Créditos agregados</p>
                <p className="text-3xl font-bold text-green-600">
                  {parseInt(creditos).toLocaleString()} créditos
                </p>
              </div>
            </div>
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
          <p className="text-xs text-gray-400">
            Redirigiendo automáticamente en {countdown} segundos...
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}