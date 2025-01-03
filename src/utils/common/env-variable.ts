import dotenv from 'dotenv'
import { InternalServerError } from './exceptions'

type ConfigOption = { type: 'number' | 'boolean' | 'string' | 'object' }

const Config: Record<string, ConfigOption> = {
  PORT: { type: 'number' },
  MONGO_DB_URL: { type: 'string' }
}

type Options = {
  isRequired?: boolean
  default?: string
}

const transform = (
  variable: keyof typeof Config,
  { type }: Pick<ConfigOption, 'type'>,
  envVariable?: string
) => {
  if (typeof envVariable === 'undefined') {
    return null
  }

  const message = `Invalid value for ${variable}. Expected: ${type}, recieved: ${envVariable}`

  if (type === 'number') {
    const numeric = Number(envVariable)

    if (Number.isNaN(numeric)) {
      throw new InternalServerError(message)
    }

    return numeric
  }

  if (type === 'boolean') {
    return envVariable === '1' || envVariable === 'true'
  }

  if (type === 'object') {
    try {
      return JSON.parse(envVariable)
    } catch {
      throw new InternalServerError(message)
    }
  }

  return String(envVariable)
}

const validate = (variable: keyof typeof Config, options: Options) => {
  dotenv.config()

  const envVariable = process.env[variable] ?? options.default

  if (typeof envVariable === 'undefined' && options.isRequired) {
    throw new InternalServerError(`${variable} is missing`)
  }

  return envVariable
}

export function envVariable<T = string>(variable: keyof typeof Config, options: Options = {}) {
  const configOptions = Config[variable]

  if (!configOptions) {
    throw new InternalServerError(`Missing description in config for ${variable}`)
  }

  const result = validate(variable, options)

  return transform(variable, configOptions, result) as T
}
