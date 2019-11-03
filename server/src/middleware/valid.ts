import validator from 'validator'
import koaValidator from 'koa-middle-validator'
import * as validate from '../utils/validate'

let customValidators = {}

// bind self validator to customValidators
Object
  .keys(validate)
  .filter(key => key.indexOf('is') === 0)
  .forEach(key => customValidators[key] = validate[key])

// handle array item type check
customValidators['inArray'] = (param: any[], validatorName: string) => {
  const validatorFn = customValidators[validatorName] || validator[validatorName]
  return param.every(validatorFn)
}

const valid = () => koaValidator({
  errorFormatters: (param: any, message: string, value: any) => ({
    param,
    message,
    value,
  }),
  customValidators: {
    ...customValidators,
    custom: (value: any, callback: (value: any) => void) => {
      if (typeof value !== 'undefined') {
        return callback(value)
      }
      return false
    },
  },
})

export default valid
