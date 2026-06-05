// src/services/referidos.service.ts
import { api } from "@/lib/api";

export interface ResumenReferidos {
  codigo_referido: string;
  ganancias_totales: number;
  cantidad_referidos: number;
  referidos_activos: number;
}

export interface Referido {
  id: string;
  nombre: string;
  email: string;
  fecha_registro: string;
  creditos_generados: number;
  estado: "ACTIVO" | "INACTIVO";
}

export interface GananciasReferido {
  id: string;
  tipo: "REGISTRO" | "PRIMERA_PREDICCION" | "RECARGA";
  monto: number;
  fecha: string;
  referido_nombre: string;
  descripcion: string;
}

export const referidosService = {
  // Obtener resumen del referido
  getResumen: async (): Promise<ResumenReferidos> => {
    try {
      const response = await api.get("/referidos/mi-resumen");
      return {
        codigo_referido: response.data.codigo_referido,
        ganancias_totales: Number(response.data.ganancias_totales),
        cantidad_referidos: response.data.cantidad_referidos,
        referidos_activos: response.data.referidos_activos || 0,
      };
    } catch (error) {
      console.error("Error fetching referidos summary:", error);
      return {
        codigo_referido: "",
        ganancias_totales: 0,
        cantidad_referidos: 0,
        referidos_activos: 0,
      };
    }
  },

  // Obtener lista de referidos
  getMisReferidos: async (): Promise<Referido[]> => {
    try {
      const response = await api.get("/referidos/mis-referidos");
      return response.data;
    } catch (error) {
      console.error("Error fetching referidos:", error);
      return [];
    }
  },

  // Obtener ganancias detalladas
  getGanancias: async (): Promise<GananciasReferido[]> => {
    try {
      const response = await api.get("/referidos/mis-ganancias");
      return response.data;
    } catch (error) {
      console.error("Error fetching ganancias:", error);
      return [];
    }
  },

  // Copiar código al portapapeles
  copiarCodigo: (codigo: string): void => {
    navigator.clipboard.writeText(codigo);
  },
};