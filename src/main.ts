import bodyParser from 'body-parser'
import express, { Application, Request, Response } from 'express'
import morgan from 'morgan'
import { errorMiddleware } from './middlewares'
import { userRouter } from './modules'
import { connectDatabase, envVariable } from './utils'

const app: Application = express()

app.disable('x-powered-by')
app.set('etag', false)

app.use(morgan('dev'))

app.use(bodyParser.json({ limit: '6mb' }))
app.use(bodyParser.urlencoded({ limit: '6mb', extended: true }))

app.use('/users', userRouter)

const port = envVariable<number>('PORT', { isRequired: true })

app.get('/', (req: Request, res: Response) => {
  res.send('Healthcheck')
})

app.use(errorMiddleware)
;(async function bootstrap() {
  await connectDatabase()

  app.listen(port, () => {
    console.log(`Server is running at ${port}`)
  })
})()
