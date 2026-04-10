import { api } from "@/lib/api";

export interface Notificacion {
  id: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  leida: boolean;
  fecha_creacion: string;
}

export const notificacionService = {
  // Obtener notificaciones del usuario
  async getNotificaciones(): Promise<Notificacion[]> {
    try {
      const res = await api.get("/usuario/notificaciones");
      return res.data;
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
      return [];
    }
  },

  // Marcar notificación como leída
  async marcarLeida(id: string): Promise<void> {
    try {
      await api.patch(`/usuario/notificaciones/${id}/leer`);
    } catch (error) {
      console.error("Error marcando notificación:", error);
    }
  },

  // Crear notificación local (simulación)
  async crearNotificacionLocal(titulo: string, mensaje: string): Promise<Notificacion> {
    return {
      id: Date.now().toString(),
      tipo: "PREDICCION",
      titulo,
      mensaje,
      leida: false,
      fecha_creacion: new Date().toISOString()
    };
  },

  // Enviar notificación por correo (simulación)
  async enviarEmailConfirmacion(email: string, eventoNombre: string, cantidadGurus: number): Promise<boolean> {
    try {
      // Simular envío de email
      console.log(`📧 Enviando email a ${email}`);
      console.log(`   Asunto: Confirmación de predicción - Gurú`);
      console.log(`   Mensaje: Has comprado ${cantidadGurus} Gurú(s) para el evento "${eventoNombre}".`);
      console.log(`   Tu predicción ha sido registrada exitosamente.`);
      
      // En producción, aquí iría la llamada real a la API de email
      // await api.post("/email/enviar", { email, eventoNombre, cantidadGurus });
      
      return true;
    } catch (error) {
      console.error("Error enviando email:", error);
      return false;
    }
  }
};