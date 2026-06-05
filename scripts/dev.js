// D:\Guru\guru-frontend\scripts\dev.js
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando Next.js con optimizaciones de memoria...');

// Variables para memoria óptima (4GB)
const nodeOptions = [
  '--max-old-space-size=4096',
  '--expose-gc',
  '--optimize-for-size',
].join(' ');

// Ejecutar Next.js con opciones optimizadas
const next = spawn('node', [
  ...nodeOptions.split(' '),
  './node_modules/.bin/next',
  'dev'
], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_OPTIONS: nodeOptions,
    NEXT_TELEMETRY_DISABLED: '1',
    NODE_NO_WARNINGS: '1',
  },
});

next.on('close', (code) => {
  console.log(`✨ Proceso finalizado con código ${code}`);
});

next.on('error', (err) => {
  console.error('❌ Error:', err);
});