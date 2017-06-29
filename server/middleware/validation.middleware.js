const _ = require('lodash');
const validator = require('validator');
const koaValidator = require('koa-middle-validator');

/**
 * 自定义验证
 */
module.exports = () => koaValidator({
  errorFormatters: (param, message, value) => {
    return {
      param: param,
      message: message,
      value: value
    };
  },
  customValidators: {
    isEmail: value => /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value),
    isMobile: value => /^1[3|4|5|7|8]\d{9}$/.test(value),
    isString: value => _.isString(value),
    isNumber: value => _.isNumber(Number(value)),
    isObject: value => _.isObject(value),
    isArray: value => _.isArray(value),
    inArray: param => {
      const argumentsArray = [].slice.apply(arguments);
      const validatorName = argumentsArray[1];

      return _.every(param, item => {
        let validatorOptions = _.tail(argumentsArray);
        validatorOptions.unshift(item);

        switch(validatorOptions[1]) {
          case 'isEmail': return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value); break;
          case 'isMobile': return /^1[3|4|5|7|8]\d{9}$/.test(value); break;
          case 'isString': return _.isString(item); break;
          case 'isNumber': return _.isNumber(item); break;
          case 'isObject': return _.isObject(item); break;
          case 'isArray': return _.isArray(item); break;
          case 'isBoolean':
            switch (typeof value) {
              case 'string': return value === 'true' || value === 'false'; break;
              case 'boolean': return value === true || value === false; break;
              default: return false;
            }
            break;
          default:
            return validator[validatorName].apply(this, validatorOptions);
        }
      });
    },
    isBoolean: value => {
      switch (typeof value) {
        case 'string':
          return value === 'true' || value === 'false';
          break;
        case 'boolean':
          return value === true || value === false;
          break;
        default:
          return false;
      }
    },
    custom: (value, callback) => {
      if (typeof value !== 'undefined') {
        return callback(value);
      } else {
        return false;
      }
    }
  }
});

