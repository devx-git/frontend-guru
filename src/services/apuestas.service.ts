// src/services/apuestas.service.ts
import { api } from "@/lib/api";

export interface Cuota {
  resultado: "1" | "X" | "2";
  etiqueta: string;
  cuota: number;
}

export interface OpcionesApuesta {
  guru: {
    disponible: boolean;
    costo_creditos: number;
    max_gurus: number;
    descripcion: string;
  };
  apuesta: {
    disponible: boolean;
    cuotas: {
      local: Cuota;
      empate: Cuota;
      visitante: Cuota;
    };
  };
}

export interface Apuesta {
  id: string;
  evento_id: string;
  resultado_elegido: "1" | "X" | "2";
  cuota_al_apostar: number;
  monto_creditos: number;
  ganancia_potencial: number;
  ganancia_real: number;
  estado: "PENDIENTE" | "GANADA" | "PERDIDA" | "CANCELADA";
  creado_en: string;
  evento_nombre?: string;
}

export interface CrearApuestaDTO {
  evento_id: string;
  monto: number;
  resultado_elegido?: "1" | "X" | "2";
}

export const apuestasService = {
  // Obtener opciones de apuesta para un evento
  getOpciones: async (eventoId: string): Promise<OpcionesApuesta> => {
    const response = await api.get(`/apuestas/opciones/${eventoId}`);
    return response.data;
  },

  // Crear una nueva apuesta
  crearApuesta: async (data: CrearApuestaDTO): Promise<Apuesta> => {
    const response = await api.post("/apuestas", data);
    return response.data;
  },

  // Obtener mis apuestas
  getMisApuestas: async (): Promise<Apuesta[]> => {
    const response = await api.get("/apuestas/mis-apuestas");
    return response.data;
  },

  // Obtener apuestas de un evento específico
  getApuestasByEvento: async (eventoId: string): Promise<Apuesta[]> => {
    const response = await api.get(`/apuestas/mis-apuestas/evento/${eventoId}`);
    return response.data;
  },
};