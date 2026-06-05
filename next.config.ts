// D:\Guru\guru-frontend\next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack config (vacío para usar valores por defecto)
  turbopack: {},
  
  // Optimizaciones de compilación
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimizar imágenes - Usar remotePatterns en lugar de domains (deprecated)
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },
  
  // Evitar re-compilaciones innecesarias
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig