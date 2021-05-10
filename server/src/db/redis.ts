import redis from 'redis'
import { promisify } from 'util'
import { REDIS } from '../config'
import { logger } from '../utils'

const client = redis.createClient(REDIS)

client.on('error', err => {
  logger.error(`Redis connection error: ${err}!`)
  process.exit(1)
})

export const set = promisify(client.set).bind(client)
export const get = promisify(client.get).bind(client)
export const del = promisify(client.del).bind(client)
