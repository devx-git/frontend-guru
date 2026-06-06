"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Coins, 
  CreditCard,
  QrCode,
  Bitcoin,
  Wallet,
  Loader2,
  AlertCircle,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/auth.store";

export default function RecargarPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [cantidadCreditos, setCantidadCreditos] = useState(10);
  const [metodoPago, setMetodoPago] = useState("qr");
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1 crédito = 1 USD
  const totalUSD = cantidadCreditos;
  const userName = user?.nombre || user?.email || "Usuario";

  const opcionesRapidas = [5, 10, 20, 50, 100];

  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = parseInt(e.target.value);
    if (!isNaN(valor) && valor > 0) {
      setCantidadCreditos(valor);
    }
  };

  const handleRecargar = async () => {
    setProcesando(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push(`/recargar/exito?creditos=${cantidadCreditos}`);
    } catch (err) {
      console.error("Error en recarga:", err);
      setError("Error al procesar la recarga. Intenta nuevamente.");
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
              1 crédito = 1 USD • Convierte tu dinero en predicciones
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Selector de cantidad */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <Label className="text-gray-300 mb-3 block">¿Cuántos créditos quieres comprar?</Label>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {opcionesRapidas.map(op => (
                  <Button
                    key={op}
                    variant={cantidadCreditos === op ? "default" : "outline"}
                    className={cantidadCreditos === op 
                      ? "bg-gradient-to-r from-blue-600 to-green-600 rounded-full" 
                      : "rounded-full border-white/20 text-white hover:bg-white/10"}
                    onClick={() => setCantidadCreditos(op)}
                  >
                    {op} créditos
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-4 items-center">
                <Input
                  type="number"
                  value={cantidadCreditos}
                  onChange={handleCantidadChange}
                  className="text-center text-xl font-bold bg-white/5 border-white/10 text-white focus:border-green-500 focus:ring-green-500/20 rounded-lg"
                  min={1}
                  step={1}
                />
                <span className="text-gray-400">créditos</span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total a pagar:</span>
                  <span className="text-2xl font-bold text-green-400">
                    ${totalUSD.toLocaleString()} USD
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Equivalente a {cantidadCreditos} créditos
                </p>
              </div>
            </div>

            {/* Métodos de pago */}
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
                  <p className="text-sm text-gray-400">
                    Escanea el código QR con tu app bancaria
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Monto: ${totalUSD} USD
                  </p>
                </div>
              </TabsContent>

              {/* Criptomonedas */}
              <TabsContent value="crypto" className="space-y-4 mt-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Bitcoin className="w-5 h-5 text-orange-400" />
                    <span className="font-medium text-white">Bitcoin (BTC)</span>
                  </div>
                  <code className="text-xs bg-black/50 px-2 py-1 rounded block truncate text-gray-300">
                    bc1qxyz...123456789
                  </code>
                  <p className="text-xs text-gray-500 mt-2">
                    Enviar ${totalUSD} USD equivalentes en BTC
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-400 text-lg font-bold">Ξ</span>
                    <span className="font-medium text-white">Ethereum (ETH)</span>
                  </div>
                  <code className="text-xs bg-black/50 px-2 py-1 rounded block truncate text-gray-300">
                    0x123456789abcdef...
                  </code>
                  <p className="text-xs text-gray-500 mt-2">
                    Enviar ${totalUSD} USD equivalentes en ETH
                  </p>
                </div>
              </TabsContent>

              {/* PayPal */}
              <TabsContent value="paypal" className="space-y-4 mt-4">
                <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                  <Wallet className="w-16 h-16 text-blue-400 mx-auto mb-3" />
                  <p className="text-gray-400 mb-2">Paga de forma segura con PayPal</p>
                  <Button className="bg-[#0070ba] hover:bg-[#003087] text-white rounded-full px-6">
                    Pagar ${totalUSD} USD con PayPal
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
              onClick={handleRecargar}
              disabled={procesando}
            >
              {procesando ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Procesando pago...
                </>
              ) : (
                `Comprar ${cantidadCreditos} créditos por $${totalUSD} USD`
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}