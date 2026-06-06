"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaypalIcon } from "@/components/icons/PaypalIcon";
import { 
  ArrowLeft, 
  QrCode, 
  Bitcoin, 
  Wallet,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  Coins,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

  const qrData = "00020101021126330014br.gov.bcb.pix0114+551199999999952040000530398654040.005802BR5913Guru Sports6009Sao Paulo62140510GURU6304E2A3";
  const walletBTC = "bc1qxyz...123456789";
  const walletETH = "0x123456789abcdef...";
  const paypalEmail = "pagos@kicklast.com";

  const handleCopiar = (texto: string) => {
    navigator.clipboard.writeText(texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmarPago = async () => {
    setProcesando(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push(`/pago/exito?evento=${eventoId}`);
    } catch (err) {
      console.error("Error en pago:", err);
      setError("Error al procesar el pago. Intenta nuevamente.");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Fondo lobby */}
      <div className="fixed inset-0 w-full h-full bg-[url('/img/lobby.jpg')] bg-cover bg-center opacity-30 z-[-2]" />
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90 z-[-1]" />
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[linear-gradient(rgba(141,198,63,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(141,198,63,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative z-10 max-w-2xl mx-auto space-y-6 py-8 px-4">
        
        {/* Botón volver */}
        <Button
          variant="ghost"
          className="-ml-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        {/* Card principal */}
        <Card className="relative overflow-hidden bg-black/80 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-full blur-2xl" />
          
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Coins className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Recargar créditos
            </CardTitle>
            <CardDescription className="text-gray-400">
              Selecciona tu método de pago favorito
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Resumen */}
            <div className="bg-white/5 rounded-xl p-4 text-center border border-green-500/30">
              <p className="text-sm text-gray-400">Total a pagar</p>
              <p className="text-3xl font-bold text-green-400">${monto} USD</p>
              <p className="text-xs text-gray-500 mt-1">2 créditos para comprar Gurú</p>
            </div>

            {/* Tabs de métodos de pago */}
            <Tabs defaultValue="qr" onValueChange={setMetodoPago}>
              <TabsList className="grid grid-cols-3 w-full bg-white/5 border border-white/10 rounded-xl p-1">
                <TabsTrigger value="qr" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-green-600 data-[state=active]:text-white rounded-lg gap-2">
                  <QrCode className="w-4 h-4" />
                  <span className="hidden sm:inline">QR</span>
                </TabsTrigger>
                <TabsTrigger value="crypto" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-green-600 data-[state=active]:text-white rounded-lg gap-2">
                  <Bitcoin className="w-4 h-4" />
                  <span className="hidden sm:inline">Cripto</span>
                </TabsTrigger>
                <TabsTrigger value="paypal" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-green-600 data-[state=active]:text-white rounded-lg gap-2">
                  <Wallet className="w-4 h-4" />
                  <span className="hidden sm:inline">PayPal</span>
                </TabsTrigger>
              </TabsList>

              {/* QR */}
              <TabsContent value="qr" className="space-y-4 mt-4">
                <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                  <div className="bg-black/50 inline-block p-4 rounded-xl shadow-sm mb-4">
                    <div className="w-48 h-48 bg-gray-800 rounded-lg flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-gray-500" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">Escanea el código QR con tu app bancaria</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <code className="text-xs bg-black/50 px-2 py-1 rounded text-gray-300">
                      {qrData.substring(0, 20)}...
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopiar(qrData)}
                      className="h-8 text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Criptomonedas */}
              <TabsContent value="crypto" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Bitcoin className="w-5 h-5 text-orange-400" />
                      <span className="font-medium text-white">Bitcoin (BTC)</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-xs bg-black/50 px-2 py-1 rounded flex-1 truncate text-gray-300">
                        {walletBTC}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopiar(walletBTC)}
                        className="h-8 text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-400 text-lg font-bold">Ξ</span>
                      <span className="font-medium text-white">Ethereum (ETH)</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-xs bg-black/50 px-2 py-1 rounded flex-1 truncate text-gray-300">
                        {walletETH}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopiar(walletETH)}
                        className="h-8 text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* PayPal */}
              <TabsContent value="paypal" className="space-y-4 mt-4">
                <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                  <PaypalIcon className="w-16 h-16 text-blue-400 mx-auto mb-3" />
                  <p className="text-gray-400 mb-2">Paga de forma segura con PayPal</p>
                  <p className="text-sm text-gray-500 mb-4">Cuenta: {paypalEmail}</p>
                  <Button className="bg-[#0070ba] hover:bg-[#003087] text-white rounded-full px-6">
                    Pagar con PayPal
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleConfirmarPago}
              disabled={procesando}
            >
              {procesando ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Procesando pago...
                </>
              ) : (
                "Confirmar pago"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}