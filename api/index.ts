import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express, { Application, Request, Response } from 'express'
import morgan from 'morgan'
import { errorMiddleware } from './middlewares'
import { authMiddleware } from './middlewares/auth.middleware'
import {
  authRouter,
  cashAccountRouter,
  categoryRouter,
  operationRouter,
  userRouter
} from './modules'
import { dashboardRouter } from './modules/dashboard'
import { envVariable, onApplicationBootstrap } from './utils'

const app: Application = express()

app.disable('x-powered-by')
app.set('etag', false)

app.use(morgan('dev'))

app.use(bodyParser.json({ limit: '6mb' }))
app.use(bodyParser.urlencoded({ limit: '6mb', extended: true }))
app.use(cookieParser(envVariable('COOKIE_SECRET', { isRequired: true })))

app.use('/api/users', authMiddleware, userRouter)
app.use('/api/category', authMiddleware, categoryRouter)
app.use('/api/regular-operation', authMiddleware, operationRouter)
app.use('/api/cash-account', authMiddleware, cashAccountRouter)
app.use('/api/operation', authMiddleware, operationRouter)
app.use('/api/dashboard', authMiddleware, dashboardRouter)
app.use('/api/auth', authRouter)

const PORT = envVariable<number>('PORT', { isRequired: true })

app.get('/api', (req: Request, res: Response) => {
  res.send('Express on Vercel')
})

app.use(errorMiddleware)
;(async function bootstrap() {
  await onApplicationBootstrap()

  app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
  })
})()
