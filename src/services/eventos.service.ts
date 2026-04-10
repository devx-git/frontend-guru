// src/services/eventos.service.ts
import { api } from "@/lib/api";

// Definimos los tipos según tu schema
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
}

export const getEventosActivos = async () => {
  try {
    // Usamos el endpoint correcto de tus logs
    const res = await api.get("/eventos");
    return res.data;
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