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
  regularOperationRouter,
  userRouter
} from './modules'
import { envVariable, onApplicationBootstrap } from './utils'

const app: Application = express()

app.disable('x-powered-by')
app.set('etag', false)

app.use(morgan('dev'))

app.use(bodyParser.json({ limit: '6mb' }))
app.use(bodyParser.urlencoded({ limit: '6mb', extended: true }))
app.use(cookieParser(envVariable('COOKIE_SECRET', { isRequired: true })))

app.use('/users', authMiddleware, userRouter)
app.use('/category', authMiddleware, categoryRouter)
app.use('/regular-operation', authMiddleware, regularOperationRouter)
app.use('/cash-account', authMiddleware, cashAccountRouter)
app.use('/auth', authRouter)

const PORT = envVariable<number>('PORT', { isRequired: true })

app.get('/', (req: Request, res: Response) => {
  res.send('Healthcheck')
})

app.use(errorMiddleware)
;(async function bootstrap() {
  await onApplicationBootstrap()

  app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
  })
})()
