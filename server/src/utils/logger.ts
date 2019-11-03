import path from 'path'
import tracer from 'tracer'

// 日志
const dailyfile = tracer.dailyfile({
  root: path.join(__dirname, '../../logs'),
  maxLogFiles: 10,
  format: '{{timestamp}} {{message}}',
  dateformat: 'mm-dd HH:MM:ss',
})

// 打印
const colorConsole = tracer.colorConsole()

// 绑定
export default {
  log: colorConsole.log,
  trace: colorConsole.trace,
  debug: colorConsole.debug,
  info(...args: any[]) {
    colorConsole.info.apply(null, args)
    dailyfile.info.apply(null, args)
  },
  warn(...args: any[]) {
    colorConsole.warn.apply(null, args)
    dailyfile.warn.apply(null, args)
  },
  error(...args: any[]) {
    colorConsole.error.apply(null, args)
    dailyfile.error.apply(null, args)
  },
}