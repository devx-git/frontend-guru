"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Coins, 
  DollarSign,
  CreditCard,
  QrCode,
  Bitcoin,
  Wallet,
  Loader2,
  AlertCircle
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
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Conectar con backend para registrar el pago y agregar créditos
      // const res = await api.post("/pagos/recargar", {
      //   creditos: cantidadCreditos,
      //   metodo: metodoPago,
      //   monto_usd: totalUSD
      // });
      
      // Redirigir a éxito
      router.push(`/recargar/exito?creditos=${cantidadCreditos}`);
    } catch (err) {
      console.error("Error en recarga:", err);
      setError("Error al procesar la recarga. Intenta nuevamente.");
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
            1 crédito = 1 USD • Convierte tu dinero en predicciones
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Selector de cantidad */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
            <Label className="text-gray-700 mb-3 block">¿Cuántos créditos quieres comprar?</Label>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {opcionesRapidas.map(op => (
                <Button
                  key={op}
                  variant={cantidadCreditos === op ? "default" : "outline"}
                  className={cantidadCreditos === op ? "bg-gradient-to-r from-blue-600 to-green-600" : ""}
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
                className="text-center text-xl font-bold"
                min={1}
                step={1}
              />
              <span className="text-gray-500">créditos</span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total a pagar:</span>
                <span className="text-2xl font-bold text-green-600">
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
                <Wallet className="w-4 h-4" />
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
                <p className="text-sm text-gray-600">
                  Escanea el código QR con tu app bancaria
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Monto: ${totalUSD} USD
                </p>
              </div>
            </TabsContent>

            {/* Criptomonedas */}
            <TabsContent value="crypto" className="space-y-4 mt-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bitcoin className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">Bitcoin (BTC)</span>
                </div>
                <code className="text-xs bg-white px-2 py-1 rounded block truncate">
                  bc1qxyz...123456789
                </code>
                <p className="text-xs text-gray-500 mt-2">
                  Enviar ${totalUSD} USD equivalentes en BTC
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-500">Ξ</span>
                  <span className="font-medium">Ethereum (ETH)</span>
                </div>
                <code className="text-xs bg-white px-2 py-1 rounded block truncate">
                  0x123456789abcdef...
                </code>
                <p className="text-xs text-gray-500 mt-2">
                  Enviar ${totalUSD} USD equivalentes en ETH
                </p>
              </div>
            </TabsContent>

            {/* PayPal */}
            <TabsContent value="paypal" className="space-y-4 mt-4">
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <Wallet className="w-16 h-16 text-blue-600 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Paga de forma segura con PayPal</p>
                <Button className="bg-[#0070ba] hover:bg-[#003087] text-white">
                  Pagar ${totalUSD} USD con PayPal
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
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 py-6 text-lg"
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
  );
}