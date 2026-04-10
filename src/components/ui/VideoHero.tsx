"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoHeroProps {
  videoSrc: string;
  posterSrc?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export function VideoHero({
  videoSrc,
  posterSrc,
  className = "",
  autoPlay = true,
  loop = true,
  muted = true,
  controls = true,
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(muted);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Manejar reproducción automática
  useEffect(() => {
    if (videoRef.current && autoPlay) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoaded(true);
          })
          .catch((error) => {
            console.log("Auto-play bloqueado:", error);
            setIsPlaying(false);
            setIsLoaded(true);
          });
      }
    }
  }, [autoPlay]);

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={posterSrc}
        autoPlay={autoPlay}
        loop={loop}
        muted={isMuted}
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        onCanPlay={() => setIsLoaded(true)}
      >
        <source src={videoSrc} type="video/mp4" />
        Tu navegador no soporta videos.
      </video>

      {/* Overlay gradiente para mejor legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-900/50 to-green-900/70 z-10"></div>

      {/* Controles de video (solo visibles en hover o móvil) */}
      {controls && isLoaded && (
        <div className="absolute bottom-4 right-4 z-20 flex gap-2">
          {/* Botón Mute/Unmute */}
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white rounded-full w-10 h-10"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>

          {/* Botón Play/Pause (opcional, visible en móvil) */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white rounded-full w-10 h-10"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </Button>
          )}
        </div>
      )}

      {/* Indicador de que el video tiene audio disponible */}
      {!isMuted && isLoaded && (
        <div className="absolute bottom-4 left-4 z-20 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Volume2 className="w-3 h-3" />
          <span>Audio activo</span>
        </div>
      )}
    </div>
  );
}