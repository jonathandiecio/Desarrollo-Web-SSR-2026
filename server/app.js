// Funcion para manejar errores en la aplicacion
import createError from 'http-errors'

// Importar el framework express
import express from 'express'

// Importa modulos para manejar rutas
import path from 'node:path'

// Importa modulos para manejar cookies
import cookieParser from 'cookie-parser'

// Importa modulos para manejar logs
import logger from 'morgan'

// Imports para crear __dirname
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

// Crear las variables para __filename y __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Importar las rutas de la aplicacion
import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'

// Crear la aplicacion express
const app = express()

// Configurar el motor de vistas
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

// Configurar middlewares de la aplicacion
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Configurar la carpeta de archivos estaticos
app.use(express.static(path.join(__dirname, '..', 'public')))

// Registramos las rutas de la aplicacion
app.use('/', indexRouter)
app.use('/users', usersRouter)

// Capturamos errores 404 y los enviamos al manejador de errores
app.use(function(req, res, next) {
  next(createError(404))
})

// Manejador de errores
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // Render the error page
  res.status(err.status || 500)
  res.render('error')
})

// Exportar la aplicacion
export default app