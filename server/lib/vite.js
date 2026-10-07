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
export function viteAssets() {
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
      <script type="module" src="${devServer}/src/main.js"></script>
    `;
  }

  // Ruta al manifiesto de Vite
  const manifestPath = path.join(__dirname, '..', '..', 'dist', '.vite', 'manifest.json');

  // Si no existe el manifest
  if (!fs.existsSync(manifestPath)) {
    console.warn("Vite manifest not found. Run 'npm run build'");
    return '';
  }

  // Leyendo y parseando a JSON el archivo
  // de manifiesto que genera vite en la compilacion
  // de los archivos del front-end
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  // Obteniendo la ruta del punto de entrada del front-end
  const mainEntry = manifest['src/main.js'] || manifest['main.js'];

  // Guarda el main.js
  if (!mainEntry) {
    console.warn('El archivo main.js no esta disponible en el manifiesto de Vite');
    return '';
  }

  let tags = '';

  if (mainEntry.css) {
    mainEntry.css.forEach((cssFile) => {
      tags += `<link rel="stylesheet" href="/${cssFile}">`;
    });
  }

  tags += `<script type="module" src="/${mainEntry.file}"></script>`;

  return tags;
}

export function registerViteHelper(hbs) {
  hbs.registerHelper('viteAssets', () => {
    return new hbs.SafeString(viteAssets());
  });
}