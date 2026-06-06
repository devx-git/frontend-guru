"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Plus,
  Loader2,
  Filter,
  Download,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { saldoService, Movimiento } from "@/services/saldo.service";
import { useAuthStore } from "@/store/auth.store";

const getTipoIcon = (tipo: string) => {
  switch(tipo) {
    case "AJUSTE":
    case "CREDITO_INICIAL":
    case "CREDITO_GANANCIA":
    case "MEMBRESIA":
      return <ArrowDownLeft className="w-4 h-4 text-green-400" />;
    case "DEBITO_PREDICCION":
    case "RETIRO":
      return <ArrowUpRight className="w-4 h-4 text-red-400" />;
    default:
      return <Coins className="w-4 h-4 text-gray-500" />;
  }
};

const getTipoNombre = (tipo: string) => {
  switch(tipo) {
    case "AJUSTE": return "Ajuste manual";
    case "CREDITO_INICIAL": return "Crédito inicial";
    case "CREDITO_GANANCIA": return "Ganancia";
    case "DEBITO_PREDICCION": return "Compra de Gurú";
    case "RETIRO": return "Retiro";
    case "MEMBRESIA": return "Membresía";
    default: return tipo;
  }
};

const getTipoColor = (tipo: string) => {
  switch(tipo) {
    case "AJUSTE":
    case "CREDITO_INICIAL":
    case "CREDITO_GANANCIA":
    case "MEMBRESIA":
      return "text-green-400 bg-green-500/20";
    case "DEBITO_PREDICCION":
    case "RETIRO":
      return "text-red-400 bg-red-500/20";
    default:
      return "text-gray-400 bg-white/5";
  }
};

export default function WalletPage() {
  const { user } = useAuthStore();
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [saldoActual, movimientosData] = await Promise.all([
          saldoService.getSaldo(),
          saldoService.getMovimientos()
        ]);
        setSaldo(saldoActual);
        setMovimientos(movimientosData);
      } catch (error) {
        console.error("Error cargando wallet:", error);
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, []);

  const movimientosFiltrados = movimientos.filter(m => {
    if (filter !== "todos" && m.tipo !== filter) return false;
    if (searchTerm && !m.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalIngresos = movimientos
    .filter(m => m.tipo === 'AJUSTE' || m.tipo === 'CREDITO_INICIAL' || m.tipo === 'CREDITO_GANANCIA')
    .reduce((sum, m) => sum + Number(m.monto), 0);
  
  const totalEgresos = movimientos
    .filter(m => m.tipo === 'DEBITO_PREDICCION' || m.tipo === 'RETIRO')
    .reduce((sum, m) => sum + Number(m.monto), 0);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <Flame className="w-8 h-8 text-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-400">Cargando tu wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Fondo lobby */}
      <div className="fixed inset-0 w-full h-full bg-[url('/img/lobby.jpg')] bg-cover bg-center opacity-30 z-[-2]" />
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90 z-[-1]" />
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[linear-gradient(rgba(141,198,63,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(141,198,63,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6 p-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-green-500 to-emerald-500 bg-clip-text text-transparent">
              Wallet
            </h1>
            <p className="text-gray-400 mt-1">
              Gestiona tus créditos y movimientos
            </p>
          </div>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
            <Link href="/recargar">
              <Plus className="w-4 h-4 mr-2" />
              Recargar créditos
            </Link>
          </Button>
        </div>

        {/* Saldo Total */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Saldo disponible</p>
                <p className="text-4xl font-bold mt-1">{saldo.toLocaleString()} créditos</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Coins className="w-7 h-7" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="relative overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 shadow-xl rounded-2xl">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Total ingresos</p>
                  <p className="text-xl font-bold text-green-400">{totalIngresos.toLocaleString()} créditos</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500/20" />
              </div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 shadow-xl rounded-2xl">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Total egresos</p>
                  <p className="text-xl font-bold text-red-400">{totalEgresos.toLocaleString()} créditos</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-500/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={filter === "todos" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("todos")}
              className={filter === "todos" ? "bg-gradient-to-r from-blue-600 to-green-600 shadow-md rounded-full" : "rounded-full border-white/20 text-white hover:bg-white/10"}
            >
              Todos
            </Button>
            <Button 
              variant={filter === "CREDITO_GANANCIA" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("CREDITO_GANANCIA")}
              className={filter === "CREDITO_GANANCIA" ? "bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" : "rounded-full border-white/20 text-white hover:bg-white/10"}
            >
              Ingresos
            </Button>
            <Button 
              variant={filter === "DEBITO_PREDICCION" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("DEBITO_PREDICCION")}
              className={filter === "DEBITO_PREDICCION" ? "bg-gradient-to-r from-red-500 to-orange-500 rounded-full" : "rounded-full border-white/20 text-white hover:bg-white/10"}
            >
              Egresos
            </Button>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Buscar..."
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500/20 rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Lista de movimientos */}
        {movimientosFiltrados.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 rounded-2xl">
            <CardContent className="py-12 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-10 h-10 text-gray-600" />
              </div>
              <p className="text-gray-400">No hay movimientos registrados</p>
              <Button variant="outline" className="mt-4 rounded-full border-white/20 text-white hover:bg-white/10" asChild>
                <Link href="/recargar">Realizar primera recarga</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y divide-white/10">
                {movimientosFiltrados.map((mov) => (
                  <div key={mov.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getTipoColor(mov.tipo)}`}>
                        {getTipoIcon(mov.tipo)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{getTipoNombre(mov.tipo)}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(mov.creado_en).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        mov.tipo === 'DEBITO_PREDICCION' || mov.tipo === 'RETIRO' 
                          ? 'text-red-400' 
                          : 'text-green-400'
                      }`}>
                        {mov.tipo === 'DEBITO_PREDICCION' || mov.tipo === 'RETIRO' ? '-' : '+'}
                        {Number(mov.monto).toLocaleString()} créditos
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{mov.descripcion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}