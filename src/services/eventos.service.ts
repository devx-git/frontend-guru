// src/services/eventos.service.ts
import { api } from "@/lib/api";

// Definimos los tipos según tu schema
export interface Campeonato {
  id: string;
  nombre: string;
}

export interface Partido {
  id: string;
  equipo_local: string;
  equipo_visitante: string;
  fecha: string;
  estado: string;
  resultado_local?: number;
  resultado_visitante?: number;
}

export interface Evento {
  id: string;
  nombre: string;
  campeonato_id: string;
  promotor_id: string;
  tipo_evento: "PUBLICO" | "PRIVADO" | "VIP";
  acumulado_base: number;
  acumulado_actual: number;
  porcentaje_casa: number;
  porcentaje_pozo: number;
  porcentaje_impuesto: number;
  porcentaje_retiro: number;
  limite_prediccion: number;
  estado: "ACTIVO" | "CERRADO" | "FINALIZADO" | "LIQUIDADO";
  fecha_inicio: string;
  fecha_fin: string | null;
  fecha_resolucion: string | null;
  utilidad_promotor: number;
  impuestos_pagados: number;
  cerrado: boolean;
  campeonato?: Campeonato;
  partidos?: Partido[];
}

const normalizeEvento = (evento: any): Evento => ({
  ...evento,
  acumulado_base: Number(evento.acumulado_base),
  acumulado_actual: Number(evento.acumulado_actual),
  porcentaje_casa: Number(evento.porcentaje_casa),
  porcentaje_pozo: Number(evento.porcentaje_pozo),
  porcentaje_impuesto: Number(evento.porcentaje_impuesto),
  porcentaje_retiro: Number(evento.porcentaje_retiro),
  limite_prediccion: Number(evento.limite_prediccion),
  utilidad_promotor: Number(evento.utilidad_promotor),
  impuestos_pagados: Number(evento.impuestos_pagados),
});

export const getEventosActivos = async (): Promise<Evento[]> => {
  try {
    const res = await api.get("/eventos");

    const data = Array.isArray(res.data)
      ? res.data
      : res.data.data || [];

    return data.map(normalizeEvento);
  } catch (error) {
    console.error("Error cargando eventos:", error);
    return [];
  }
};

export const getEventoDetalle = async (id: string): Promise<Evento> => {
  try {
    const res = await api.get(`/eventos/${id}/detalle`);
    return res.data;
  } catch (error) {
    console.error("Error cargando detalle del evento:", error);
    throw error;
  }
};