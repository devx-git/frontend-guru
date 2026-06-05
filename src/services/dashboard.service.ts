// src/services/dashboard.service.ts
import { api } from "@/lib/api";

export interface DashboardStats {
  gurusComprados: number;
  aciertos: number;
  ganancias: number;
  saldo: number;
  racha_actual: number;
  mejor_racha: number;
  total_predicciones: number;
  total_apuestas: number;
}

export interface ActividadReciente {
  id: string;
  tipo: "PREDICCION" | "APUESTA" | "RECARGA" | "RETIRO" | "GANANCIA";
  descripcion: string;
  monto: number;
  fecha: string;
  estado: "PENDIENTE" | "COMPLETADO" | "FALLIDO";
}

export interface TopGuru {
  id: string;
  nombre: string;
  aciertos: number;
  total_predicciones: number;
  porcentaje_acierto: number;
  avatar_url?: string;
}

export const dashboardService = {
  // Obtener estadísticas del dashboard
  getStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get("/usuario/dashboard");
      return {
        gurusComprados: response.data.gurus_activos || 0,
        aciertos: response.data.porcentaje_aciertos || 0,
        ganancias: response.data.ganancias_totales || 0,
        saldo: response.data.saldo || 0,
        racha_actual: response.data.racha_actual || 0,
        mejor_racha: response.data.mejor_racha || 0,
        total_predicciones: response.data.total_predicciones || 0,
        total_apuestas: response.data.total_apuestas || 0,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },

  // Obtener actividad reciente
  getActividadReciente: async (limite: number = 5): Promise<ActividadReciente[]> => {
    try {
      const response = await api.get("/usuario/historial", {
        params: { limite },
      });
      return response.data.map((item: any) => ({
        id: item.id,
        tipo: item.tipo,
        descripcion: item.descripcion,
        monto: Number(item.monto),
        fecha: item.creado_en,
        estado: item.estado || "COMPLETADO",
      }));
    } catch (error) {
      console.error("Error fetching activity:", error);
      return [];
    }
  },

  // Obtener top gurús del usuario
  getTopGurus: async (limite: number = 5): Promise<TopGuru[]> => {
    try {
      const response = await api.get("/stats/ranking", {
        params: { limite },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching top gurus:", error);
      return [];
    }
  },
};