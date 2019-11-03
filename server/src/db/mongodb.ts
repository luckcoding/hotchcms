import mongoose from 'mongoose'
import { DB_PATH  } from '../config'
import logger from '../utils/logger'

mongoose.set('useCreateIndex', true)
mongoose.connect(DB_PATH, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection

db.on('error', err => {
  logger.error(`MongoDB connection error: ${err}!`)
  process.exit(1)
})
