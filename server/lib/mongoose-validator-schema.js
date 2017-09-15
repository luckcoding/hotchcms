const _ = require('lodash')

function ValidatorChain (path) {
  this.instance = path.instance
  this.pathName = path.path
  this.options = path.options

  let schema = _.assign(this._type(), this._options())

  return { [this.pathName]: schema }
}

ValidatorChain.prototype._type = function () {
  return {
    [this.instance]: {
      errorMessage: `${this.pathName} 需要为 ${this.instance}`,
    },
  }
}

ValidatorChain.prototype._options = function () {
  let schema = {}
  let instance = this.instance
  let pathName = this.pathName

  function mkLength (input) {
    let isLength = schema.isLength || {}
    isLength.options = _.isEmpty(isLength.options)
      ? [input]
      : [_.assign(isLength.options[0], input)]

    let min = isLength.options[0].min
    let max = isLength.options[0].max

    isLength.errorMessage = pathName
      + (!isNaN(Number(min)) ? ` 最小长度为${min}` : '')
      + (!isNaN(Number(max)) ? ` 最大长度为${max}` : '')

    schema.isLength = _.assign(schema.isLength, isLength)
  }

  function mkNumber (input) {
    let number = schema[instance] || {}
    number.options = _.isEmpty(number.options)
      ? [input]
      : [_.assign(number.options[0], input)]

    let min = number.options[0].min
    let max = number.options[0].max

    number.errorMessage = pathName
      + (!isNaN(Number(min)) ? ` 最小为${min}` : '')
      + (!isNaN(Number(max)) ? ` 最大为${max}` : '')

    schema[instance] = _.assign(schema[instance], number)
  }

  function mkmMatch (input) {
    let matches = schema.matches || {}
    matches.options = _.isArray(input) ? [input[0]] : [input]
    matches.errorMessage = _.isArray(input) ? input[1] : `${pathName} 格式不正确`

    schema.matches = _.assign(schema.matches, matches)
  }

  function mkEnum (input) {
    let isIn = schema.isIn || {}
    isIn.options = _.isArray(input) ? [input] : input.values
    isIn.errorMessage = _.isArray(input) ? `${pathName} 必须为 ${input.join('/')}` : input.message

    schema.isIn = _.assign(schema.isIn, isIn)
  }

  function mkRequired (input) {
    input ? schema.notEmpty = {
      options: [true],
      errorMessage: `${pathName} 不能为空`,
    } : schema.optional = true
  }

  _.forEach(this.options, (option, key) => {
    switch (key) {
      case 'minlength':
      case 'maxlength':
        mkLength({ [key.substr(0, 3)]: option }); break
      case 'min':
      case 'max':
        mkNumber({ [key]: option }); break
      case 'match':
        mkmMatch(option); break
      case 'enum':
        mkEnum(option); break
      case 'required':
        mkRequired(option); break
      default:
        mkRequired(false); break
    }
  })

  return schema
}


module.exports = exports = function (schema, options) {
  let paths = schema.paths
  let typeModel = options || {
    String: 'isString',
    Boolean: 'isBoolean',
    Array: 'isArray',
    Number: 'isNumber',
    Date: 'isDate',
    ObjectID: 'isMongoId',
    Mixed: 'isMixed',
  }

  let validatorSchema = {}

  for (let path in paths) {
    if ({}.hasOwnProperty.call(paths, path)) {
      let instance = paths[path].instance
      if (_.includes(_.keys(typeModel), instance)) {
        paths[path].instance = typeModel[instance]
      }

      let chain = new ValidatorChain(paths[path])
      validatorSchema = _.assign(validatorSchema, chain)
    }
  }

  schema._validator = function (values, inputSchema) {
    let _validatorSchema = {}
    _.forEach(values, (value) => {
      let required = _.includes(value, '*')
      value = _.trimStart(value, '*')
      _validatorSchema[value] = validatorSchema[value]
      if (required) {
        delete _validatorSchema[value].optional
        if (!_validatorSchema[value].notEmpty) {
          _validatorSchema[value].notEmpty = { options: [true], errorMessage: `${value} 不能为空` }
        }
      } else {
        delete _validatorSchema[value].notEmpty
        if (!_validatorSchema[value].optional) {
          _validatorSchema[value].optional = true
        }
      }
    })

    return _.assign(_validatorSchema, inputSchema)
  }
}
