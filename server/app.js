// Importar módulos principales
import createError from 'http-errors';
import express from 'express';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import createDebug from 'debug';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// Importar HBS y la función registradora del Helper de Vite
import hbs from 'hbs';
import { registerViteHelper } from './lib/vite.js';

// Importar rutas de la aplicación mediante Import Aliases
import indexRouter from '#router/index.js';
import usersRouter from '#router/users.js';

// Configurar Debug
const debug = createDebug('desarrollo-web-ssr-2026:server');

// Determinar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

debug('🔨 Creando backend');

// Motor de plantillas (HBS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Registrar Helper de Vite en Handlebars
registerViteHelper(hbs);

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Servir estáticos de compilación en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
}

// Archivos estáticos de desarrollo
debug('🔨 Creando servidor de archivos estáticos');
app.use(express.static(path.join(__dirname, '..', 'public')));

// Registro de rutas
debug('🛣️ Registrando rutas');
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Manejo de errores
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

export default app;