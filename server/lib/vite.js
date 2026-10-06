// Biblioteca File Stream
import fs from 'node:fs';

// Biblioteca de rutas
import path from 'node:path';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// Creando las variables de rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Helper para Handlebars para que genere las etiquetas de Vite
 * EN DESARROLLO: Conecta al servidor de desarrollo de Vite
 * EN PRODUCCIÓN: Usa los compilados de Vite
 */
export function viteAssetHelper() {
  // Obtener modo de ejecución
  const isDev = process.env.NODE_ENV !== 'production';

  // Rescatando la URL del servidor de desarrollo
  const devServer =
    process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';

  // Si estamos en modo desarrollo
  if (isDev) {
    // En desarrollo, cargamos los archivos del front-end directamente del servidor de desarrollo
    return `
      <script type="module" src="${devServer}/@vite/client"></script>
      <script type="module" src="${devServer}/main.js"></script>
    `;
  }

  // En producción leemos el manifest y generamos las etiquetas de script y link
  const manifestPath = path.join(__dirname, '..', '..', 'public', '.vite', 'manifest.json');

  if (!fs.existsSync(manifestPath)) {
    console.warn(
      'Vite manifest not found. Run "npm run build" to generate it.'
    );
    return '';
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const entry = manifest['main.js'] || manifest['index.html'];

  if (!entry) return '';

  let html = `<script type="module" src="/${entry.file}"></script>`;

  if (entry.css) {
    entry.css.forEach((cssFile) => {
      html += `<link rel="stylesheet" href="/${cssFile}">`;
    });
  }

  return html;
}