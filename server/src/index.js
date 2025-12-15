import express from 'express'
import cors from 'cors'
import compression from 'compression'
import dotenv from 'dotenv'
import authRouter from './routes/auth.js'
import usersRouter from './routes/users.js'
import clinicsRouter from './routes/clinics.js'
import requestsRouter from './routes/requests.js'
import patientsRouter from './routes/patients.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(compression())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ limit: '1mb', extended: true }))

// Timeouts para evitar conexiones largas
app.use((req, res, next) => {
  req.setTimeout(30000)
  res.setTimeout(30000)
  next()
})

app.get('/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/clinics', clinicsRouter)
app.use('/api/requests', requestsRouter)
app.use('/api/patients', patientsRouter)

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  console.trace(err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

const port = process.env.PORT || 4000
const server = app.listen(port, () => {
  console.log(`API escuchando en puerto ${port}`)
})

// Timeouts del servidor
server.timeout = 30000
server.keepAliveTimeout = 65000
