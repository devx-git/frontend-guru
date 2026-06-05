// D:\Guru\guru-frontend\hooks\useMemoryOptimized.ts
import { useEffect, useRef } from 'react';

export function useMemoryOptimized<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
  cleanupDelay = 1000
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Ejecutar callback con manejo de errores
    let result: any;
    try {
      result = callback();
    } catch (error) {
      console.error('Error en callback optimizado:', error);
    }
    
    // Cleanup optimizado
    return () => {
      isMountedRef.current = false;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        if (result && typeof result === 'function') {
          try {
            result();
          } catch (error) {
            console.error('Error en cleanup:', error);
          }
        }
        
        // Forzar garbage collection si está disponible y hay mucha memoria usada
        if (global.gc && process.env.NODE_ENV === 'development') {
          const used = process.memoryUsage().heapUsed / 1024 / 1024;
          if (used > 500) { // Si usa más de 500MB
            global.gc();
          }
        }
      }, cleanupDelay);
    };
  }, deps);
}

// Hook específico para limpiar eventos y prevenir fugas
export function useCleanupOnUnmount(cleanupFn: () => void) {
  useEffect(() => {
    return () => {
      try {
        cleanupFn();
      } catch (error) {
        console.error('Error en limpieza:', error);
      }
    };
  }, [cleanupFn]);
}