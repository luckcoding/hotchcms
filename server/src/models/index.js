const path = require('path')
const { forEach, upperFirst, camelCase } = require('lodash')
const requireAll = require('require-all')

const models = requireAll({
  dirname: path.join(__dirname, './'),
  filter: /(.+)\.model\.js$/,
})

const schema = {}

forEach(models, (model, key) => {
  schema[upperFirst(camelCase(key))] = model
})

module.exports = schema
