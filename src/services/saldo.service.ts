// src/services/saldo.service.ts
import { api } from "@/lib/api";

export interface Movimiento {
  id: string;
  tipo: string;
  monto: number | string;
  descripcion: string;
  creado_en: string;
}

export interface SaldoResponse {
  saldo: number;
  moneda?: string;
}

export interface ResumenMovimientos {
  total_ingresos: number;
  total_egresos: number;
  saldo_actual: number;
}

export const saldoService = {
  // Obtener saldo desde el endpoint específico (más rápido)
  async getSaldoDirecto(): Promise<number> {
    try {
      const token = localStorage.getItem("token");
      if (!token) return 0;
      
      const res = await api.get("/creditos/saldo");
      return res.data.saldo || 0;
    } catch (error) {
      console.error("Error obteniendo saldo directo:", error);
      // Fallback al cálculo manual
      return this.getSaldo();
    }
  },

  // Obtener saldo calculando desde movimientos (más detallado)
  async getSaldo(): Promise<number> {
    try {
      const token = localStorage.getItem("token");
      if (!token) return 0;
      
      const res = await api.get("/usuario/movimientos");
      const movimientos: Movimiento[] = res.data;
      
      console.log("=== CÁLCULO DE SALDO ===");
      console.log("Movimientos recibidos:", movimientos.length);
      
      let saldo = 0;
      movimientos.forEach(mov => {
        const monto = typeof mov.monto === 'number' ? mov.monto : parseFloat(mov.monto as string);
        
        console.log(`  Tipo: ${mov.tipo}, Monto original: ${mov.monto}, Convertido: ${monto}`);
        
        // Los montos ya vienen con el signo correcto desde el backend
        // Solo sumamos el monto directamente
        saldo = saldo + monto;
        console.log(`    → Sumando ${monto}, Saldo parcial: ${saldo}`);
      });
      
      console.log("=== SALDO FINAL ===", saldo);
      return saldo;
    } catch (error) {
      console.error("Error obteniendo saldo:", error);
      return 0;
    }
  },

  // Obtener todos los movimientos
  async getMovimientos(): Promise<Movimiento[]> {
    try {
      const res = await api.get("/usuario/movimientos");
      return res.data;
    } catch (error) {
      console.error("Error obteniendo movimientos:", error);
      return [];
    }
  },

  // Descontar créditos (para usar después de comprar Gurú)
  async descontarCreditos(monto: number, descripcion: string): Promise<boolean> {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;
      
      // Obtener el usuario actual
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const usuarioId = user.id;
      
      if (!usuarioId) {
        console.error("No se encontró el ID del usuario");
        return false;
      }
      
      // Llamar a la función SQL desde el backend
      const response = await fetch("https://api.devxsolutions.pro/movimientos/descontar-creditos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          monto: monto,
          descripcion: descripcion
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`💰 Descontado ${monto} crédito(s): ${descripcion}`, data);
        return true;
      } else {
        const error = await response.text();
        console.error("Error al descontar créditos:", error);
        return false;
      }
    } catch (error) {
      console.error("Error descontando créditos:", error);
      return false;
    }
  },

  // ========== NUEVOS MÉTODOS (AGREGADOS SIN ROMPER) ==========

  // Obtener resumen de movimientos (ingresos vs egresos)
  async getResumenMovimientos(): Promise<ResumenMovimientos> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { total_ingresos: 0, total_egresos: 0, saldo_actual: 0 };
      }
      
      const movimientos = await this.getMovimientos();
      let total_ingresos = 0;
      let total_egresos = 0;
      
      movimientos.forEach(mov => {
        const monto = typeof mov.monto === 'number' ? mov.monto : parseFloat(mov.monto as string);
        if (monto > 0) {
          total_ingresos += monto;
        } else {
          total_egresos += Math.abs(monto);
        }
      });
      
      return {
        total_ingresos,
        total_egresos,
        saldo_actual: total_ingresos - total_egresos,
      };
    } catch (error) {
      console.error("Error obteniendo resumen de movimientos:", error);
      return { total_ingresos: 0, total_egresos: 0, saldo_actual: 0 };
    }
  },

  // Obtener movimientos con filtros
  async getMovimientosFiltrados(params?: {
    tipo?: string;
    limite?: number;
    pagina?: number;
  }): Promise<Movimiento[]> {
    try {
      const movimientos = await this.getMovimientos();
      let filtered = [...movimientos];
      
      if (params?.tipo) {
        filtered = filtered.filter(m => m.tipo === params.tipo);
      }
      
      if (params?.limite) {
        filtered = filtered.slice(0, params.limite);
      }
      
      return filtered;
    } catch (error) {
      console.error("Error obteniendo movimientos filtrados:", error);
      return [];
    }
  },

  // Formatear monto para mostrar
  formatearMonto(monto: number | string): string {
    const numero = typeof monto === 'number' ? monto : parseFloat(monto as string);
    const absMonto = Math.abs(numero);
    const signo = numero >= 0 ? '+' : '-';
    return `${signo}${absMonto.toLocaleString()} créditos`;
  },
};