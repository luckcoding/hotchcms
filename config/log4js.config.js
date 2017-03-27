
const categorys = ['http', 'system', 'database'];

const config = {
  appenders: [
    {
      type: 'console'
    },
    {
      "type": "file",
      "filename": "logs/app/app.log",
      "maxLogSize": 10485760,
      "numBackups": 5
    },
    {
      type: 'dateFile',
      category: 'http',
      filename: 'logs/http/http',
      pattern: '_MM_dd.log',
      alwaysIncludePattern: true
    },
    {
      type: 'dateFile',
      category: 'system',
      filename: 'logs/system/system',
      pattern: '_MM_dd.log',
      alwaysIncludePattern: true
    },
    {
      type: 'dateFile',
      category: 'database',
      filename: 'logs/database/database',
      pattern: '_MM_dd.log',
      alwaysIncludePattern: true
    },
    {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: {
        type: 'dateFile',
        filename: 'logs/errors/error',
        pattern: '_MM_dd.log',
        alwaysIncludePattern: true
      }
    }
  ],
  replaceConsole: true
};

module.exports = config;
module.exports.categorys = categorys;
