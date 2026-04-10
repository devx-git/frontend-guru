// src/services/prediccion.service.ts

interface OpcionPrediccion {
  id: string;
  valor: string;
}

interface EventoPrediccion {
  id: string;
  descripcion: string;
  tipo: string;
  opciones: OpcionPrediccion[];
}

// Jugadores para predicciones
const JUGADORES = [
  { nombre: "Messi", equipo: "Argentina" },
  { nombre: "Cristiano Ronaldo", equipo: "Portugal" },
  { nombre: "Neymar", equipo: "Brasil" },
  { nombre: "Mbappé", equipo: "Francia" },
  { nombre: "Haaland", equipo: "Noruega" },
  { nombre: "Vinícius Jr", equipo: "Brasil" },
  { nombre: "Bellingham", equipo: "Inglaterra" },
  { nombre: "Kane", equipo: "Inglaterra" },
];

const generarId = () => Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

export function generarPrediccionesDinamicas(
  equipoLocal: string,
  equipoVisitante: string
): EventoPrediccion[] {
  const predicciones: EventoPrediccion[] = [];

  // 1. Ganador del partido
  predicciones.push({
    id: generarId(),
    descripcion: "🏆 Ganador del partido",
    tipo: "MANUAL",
    opciones: [
      { id: generarId(), valor: `🏠 ${equipoLocal}` },
      { id: generarId(), valor: "🤝 Empate" },
      { id: generarId(), valor: `✈️ ${equipoVisitante}` }
    ]
  });

  // 2. Primer gol (jugador)
  predicciones.push({
    id: generarId(),
    descripcion: "⚽ ¿Quién anota el primer gol?",
    tipo: "MANUAL",
    opciones: [
      { id: generarId(), valor: "Ningún gol" },
      ...JUGADORES.map(j => ({ id: generarId(), valor: `${j.nombre} (${j.equipo})` }))
    ]
  });

  // 3. ¿Habrá penal?
  predicciones.push({
    id: generarId(),
    descripcion: "🔴 ¿Habrá penal en el partido?",
    tipo: "MANUAL",
    opciones: [
      { id: generarId(), valor: "Sí" },
      { id: generarId(), valor: "No" }
    ]
  });

  // 4. ¿Habrá tarjeta roja?
  predicciones.push({
    id: generarId(),
    descripcion: "🟥 ¿Habrá tarjeta roja?",
    tipo: "MANUAL",
    opciones: [
      { id: generarId(), valor: "Sí" },
      { id: generarId(), valor: "No" }
    ]
  });

  // 5. Total de goles
  predicciones.push({
    id: generarId(),
    descripcion: "📈 Total de goles del partido",
    tipo: "MANUAL",
    opciones: [
      { id: generarId(), valor: "0-1 goles" },
      { id: generarId(), valor: "2-3 goles" },
      { id: generarId(), valor: "4-5 goles" },
      { id: generarId(), valor: "6+ goles" }
    ]
  });

  // 6. ¿Ambos equipos marcan?
  predicciones.push({
    id: generarId(),
    descripcion: "⚽ ¿Ambos equipos marcan?",
    tipo: "MANUAL",
    opciones: [
      { id: generarId(), valor: "Sí" },
      { id: generarId(), valor: "No" }
    ]
  });

  // 7. Más corners
  predicciones.push({
    id: generarId(),
    descripcion: "🚩 ¿Qué equipo tiene más corners?",
    tipo: "MANUAL",
    opciones: [
      { id: generarId(), valor: equipoLocal },
      { id: generarId(), valor: equipoVisitante },
      { id: generarId(), valor: "Empate" }
    ]
  });

  // 8. Gol en ambos tiempos
  predicciones.push({
    id: generarId(),
    descripcion: "⏰ ¿Gol en ambos tiempos?",
    tipo: "MANUAL",
    opciones: [
      { id: generarId(), valor: "Sí" },
      { id: generarId(), valor: "No" }
    ]
  });

  // 9. Primer equipo en marcar
  predicciones.push({
    id: generarId(),
    descripcion: "🥇 ¿Qué equipo marca primero?",
    tipo: "MANUAL",
    opciones: [
      { id: generarId(), valor: equipoLocal },
      { id: generarId(), valor: equipoVisitante },
      { id: generarId(), valor: "Ninguno" }
    ]
  });

  // 10. Resultado al descanso
  predicciones.push({
    id: generarId(),
    descripcion: "⏱️ Resultado al descanso",
    tipo: "MANUAL",
    opciones: [
      { id: generarId(), valor: `${equipoLocal} gana` },
      { id: generarId(), valor: "Empate" },
      { id: generarId(), valor: `${equipoVisitante} gana` }
    ]
  });

  return predicciones;
}

export function seleccionarPrediccionesAleatorias(
  equipoLocal: string,
  equipoVisitante: string,
  cantidad: number = 10
): EventoPrediccion[] {
  const todas = generarPrediccionesDinamicas(equipoLocal, equipoVisitante);
  // Mezclar
  for (let i = todas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [todas[i], todas[j]] = [todas[j], todas[i]];
  }
  return todas.slice(0, cantidad);
}