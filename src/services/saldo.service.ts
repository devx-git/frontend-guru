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
        
        console.log(`  Tipo: ${mov.tipo}, Monto: ${monto}`);
        
        if (mov.tipo === 'AJUSTE' || mov.tipo === 'CREDITO_INICIAL' || mov.tipo === 'CREDITO_GANANCIA' || mov.tipo === 'MEMBRESIA') {
          saldo = saldo + monto;
          console.log(`    → Sumando ${monto}, Saldo parcial: ${saldo}`);
        } 
        else if (mov.tipo === 'DEBITO_PREDICCION' || mov.tipo === 'RETIRO') {
          saldo = saldo - monto;
          console.log(`    → Restando ${monto}, Saldo parcial: ${saldo}`);
        }
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
    }
};