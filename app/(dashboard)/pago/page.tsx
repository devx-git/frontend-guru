"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaypalIcon } from "@/components/icons/PaypalIcon";
import { 
  ArrowLeft, 
  CreditCard, 
  QrCode, 
  Bitcoin, 
  Wallet,
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/auth.store";

export default function PagoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const [metodoPago, setMetodoPago] = useState<string>("qr");
  const [copied, setCopied] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const monto = 2; // 2 créditos por Gurú
  const eventoId = searchParams.get("evento") || "";
  const predicciones = searchParams.get("predicciones") || "";

  // Datos de pago
  const qrData = "00020101021126330014br.gov.bcb.pix0114+551199999999952040000530398654040.005802BR5913Guru Sports6009Sao Paulo62140510GURU6304E2A3";
  const walletBTC = "bc1qxyz...123456789";
  const walletETH = "0x123456789abcdef...";
  const paypalEmail = "pagos@guru.com";

  const handleCopiar = (texto: string) => {
    navigator.clipboard.writeText(texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmarPago = async () => {
    setProcesando(true);
    setError(null);
    
    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Conectar con backend para registrar el pago
      // const res = await api.post("/pagos", {
      //   monto,
      //   metodo: metodoPago,
      //   eventoId,
      //   predicciones: JSON.parse(predicciones)
      // });
      
      // Redirigir a éxito
      router.push(`/pago/exito?evento=${eventoId}`);
    } catch (err) {
      console.error("Error en pago:", err);
      setError("Error al procesar el pago. Intenta nuevamente.");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-8">
      {/* Header */}
      <Button
        variant="ghost"
        className="-ml-2 text-gray-600"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Recargar créditos</CardTitle>
          <CardDescription>
            Selecciona tu método de pago favorito
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Resumen */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">Total a pagar</p>
            <p className="text-3xl font-bold text-green-600">${monto} USD</p>
            <p className="text-xs text-gray-500 mt-1">2 créditos para comprar Gurú</p>
          </div>

          {/* Tabs de métodos de pago */}
          <Tabs defaultValue="qr" onValueChange={setMetodoPago}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="qr" className="flex items-center gap-2">
                <QrCode className="w-4 h-4" />
                <span className="hidden sm:inline">QR</span>
              </TabsTrigger>
              <TabsTrigger value="crypto" className="flex items-center gap-2">
                <Bitcoin className="w-4 h-4" />
                <span className="hidden sm:inline">Cripto</span>
              </TabsTrigger>
              <TabsTrigger value="paypal" className="flex items-center gap-2">
                <PaypalIcon className="w-4 h-4" />
                <span className="hidden sm:inline">PayPal</span>
              </TabsTrigger>
            </TabsList>

            {/* QR */}
            <TabsContent value="qr" className="space-y-4 mt-4">
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="bg-white inline-block p-4 rounded-xl shadow-sm mb-4">
                  <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-gray-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">Escanea el código QR con tu app bancaria</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {qrData.substring(0, 20)}...
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopiar(qrData)}
                    className="h-8"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Criptomonedas */}
            <TabsContent value="crypto" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bitcoin className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">Bitcoin (BTC)</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-xs bg-white px-2 py-1 rounded flex-1 truncate">
                      {walletBTC}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopiar(walletBTC)}
                      className="h-8"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-500">Ξ</span>
                    <span className="font-medium">Ethereum (ETH)</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-xs bg-white px-2 py-1 rounded flex-1 truncate">
                      {walletETH}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopiar(walletETH)}
                      className="h-8"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* PayPal */}
            <TabsContent value="paypal" className="space-y-4 mt-4">
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <PaypalIcon className="w-16 h-16 text-blue-600 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Paga de forma segura con PayPal</p>
                <p className="text-sm text-gray-500 mb-4">Cuenta: {paypalEmail}</p>
                <Button className="bg-[#0070ba] hover:bg-[#003087] text-white">
                  Pagar con PayPal
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 py-6"
            onClick={handleConfirmarPago}
            disabled={procesando}
          >
            {procesando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Procesando pago...
              </>
            ) : (
              "Confirmar pago"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}