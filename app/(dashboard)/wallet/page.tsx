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
  Download
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
      return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
    case "DEBITO_PREDICCION":
    case "RETIRO":
      return <ArrowUpRight className="w-4 h-4 text-red-500" />;
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
      return "text-green-600 bg-green-50";
    case "DEBITO_PREDICCION":
    case "RETIRO":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
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
    .reduce((sum, m) => sum + m.monto, 0);
  
  const totalEgresos = movimientos
    .filter(m => m.tipo === 'DEBITO_PREDICCION' || m.tipo === 'RETIRO')
    .reduce((sum, m) => sum + m.monto, 0);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="text-gray-500 mt-1">
            Gestiona tus créditos y movimientos
          </p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-green-600">
          <Link href="/recargar">
            <Plus className="w-4 h-4 mr-2" />
            Recargar créditos
          </Link>
        </Button>
      </div>

      {/* Saldo Total */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Saldo disponible</p>
            <p className="text-4xl font-bold mt-1">{saldo.toLocaleString()} créditos</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total ingresos</p>
                <p className="text-xl font-bold text-green-600">{totalIngresos.toLocaleString()} créditos</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-100" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total egresos</p>
                <p className="text-xl font-bold text-red-600">{totalEgresos.toLocaleString()} créditos</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-100" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filter === "todos" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("todos")}
            className={filter === "todos" ? "bg-gradient-to-r from-blue-600 to-green-600" : ""}
          >
            Todos
          </Button>
          <Button 
            variant={filter === "CREDITO_GANANCIA" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("CREDITO_GANANCIA")}
          >
            Ingresos
          </Button>
          <Button 
            variant={filter === "DEBITO_PREDICCION" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("DEBITO_PREDICCION")}
          >
            Egresos
          </Button>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de movimientos */}
      {movimientosFiltrados.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center">
            <Coins className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay movimientos registrados</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/recargar">Realizar primera recarga</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="divide-y">
              {movimientosFiltrados.map((mov) => (
                <div key={mov.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getTipoColor(mov.tipo)}`}>
                      {getTipoIcon(mov.tipo)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{getTipoNombre(mov.tipo)}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
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
                        ? 'text-red-600' 
                        : 'text-green-600'
                    }`}>
                      {mov.tipo === 'DEBITO_PREDICCION' || mov.tipo === 'RETIRO' ? '-' : '+'}
                      {mov.monto.toLocaleString()} créditos
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{mov.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}