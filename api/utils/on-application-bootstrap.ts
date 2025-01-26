import { connectDatabase } from './db'

export const onApplicationBootstrap = async () => {
  await connectDatabase()
}
