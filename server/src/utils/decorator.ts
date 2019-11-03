import Router from 'koa-router'
import flatten from 'lodash.flatten'

function filter(obj = {}) {
  for (let key in obj) {
    (typeof obj[key] === 'undefined') && (delete obj[key])
  }
  return obj
}

const pathMeta = Symbol('pathMeta')
const methodMeta = Symbol('methodMeta')
const isCtrlMeta = Symbol('isCtrlMeta')
const summaryMeta = Symbol('summaryMeta')
const groupMeta = Symbol('groupMeta')
const middlewaresMeta = Symbol('middlewaresMeta')
const queryMeta = Symbol('queryMeta')
const bodyMeta = Symbol('bodyMeta')
const paramsMeta = Symbol('paramsMeta')
const headersMeta = Symbol('headersMeta')

export const Prefix = (path: string): ClassDecorator => {
  return target => {
    Reflect.defineMetadata(pathMeta, path, target)
  }
}

export const Group = (name: string) => {
  return (target: Object, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
    Reflect.defineMetadata(groupMeta, name, descriptor ? descriptor.value : target)
  }
}

export type MethodType = 'GET' | 'PUT' | 'POST' | 'DELETE'

export const Request = (method: MethodType, path: string): MethodDecorator => {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata(methodMeta, method, descriptor.value)
    Reflect.defineMetadata(pathMeta, path, descriptor.value)
    Reflect.defineMetadata(isCtrlMeta, true, descriptor.value)
  }
}

export const Summary = (text: string): MethodDecorator => {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata(summaryMeta, text, descriptor.value)
  }
}

export const Middlewares = (middlewares: Function[]) => {
  return (target: Object,  propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
    Reflect.defineMetadata(middlewaresMeta, middlewares, descriptor ? descriptor.value : target)
  }
}

export interface Parameters {
  [key: string]: {
    [key: string]: any,
    description?: string
  }
}

function parameters2Schema (parameters: Parameters) {
  for (const key in parameters) {
    delete parameters[key].description
  }
  return parameters
}

const createMappingDecorator = (meta: symbol) => (parameters: Parameters): MethodDecorator => {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata(meta, parameters, descriptor.value)
  }
}

export const Query = createMappingDecorator(queryMeta)
export const Body = createMappingDecorator(bodyMeta)
export const Params = createMappingDecorator(paramsMeta)
export const Headers = createMappingDecorator(headersMeta)

const mapRoute = (itemClass: any) => {
  const prefix = Reflect.getMetadata(pathMeta, itemClass) || ''
  const supGroup = Reflect.getMetadata(groupMeta, itemClass)
  const supMiddlewares = Reflect.getMetadata(middlewaresMeta, itemClass) || []

  const instance: Object = new itemClass()

  const prototype = Object.getPrototypeOf(instance)
  const methodsNames = Object.getOwnPropertyNames(prototype)
    .filter(method => method !== 'constructor' && typeof prototype[method] === 'function')


  return methodsNames
    .map((methodName: string) => {
      const fn = prototype[methodName]
      const isCtrl = (Reflect.getMetadata(isCtrlMeta, fn) as boolean) || false
      return { fn, isCtrl }
    })
    .filter(schema => schema.isCtrl)
    .map(({ fn }) => {
      let chain = []

      const route = (Reflect.getMetadata(pathMeta, fn) as string) || ''
      const method = (Reflect.getMetadata(methodMeta, fn) as string) || 'GET'
      const summary = Reflect.getMetadata(summaryMeta, fn)
      const middlewares = Reflect.getMetadata(middlewaresMeta, fn) || []
      const query = Reflect.getMetadata(queryMeta, fn)
      const body = Reflect.getMetadata(bodyMeta, fn)
      const params = Reflect.getMetadata(paramsMeta, fn)
      const headers = Reflect.getMetadata(headersMeta, fn)
      const group = Reflect.getMetadata(groupMeta, fn)
      
      chain.push(...supMiddlewares)
      chain.push(...middlewares)
      
      const check = async (ctx: any, next: any) => {
        query && ctx.checkQuery(parameters2Schema(query))
        body && ctx.checkBody(parameters2Schema(body))
        params && ctx.checkParams(parameters2Schema(params))
        headers && ctx.checkHeaders(parameters2Schema(headers))
        await next()
      }
      
      chain.push(check)

      return filter({
        group: group || supGroup || '$$ALL',
        summary,
        route: `${prefix}${route}`,
        method: method.toLowerCase(),
        fn: fn.bind(instance),
        middlewares: chain,
        query,
        body,
        params,
        headers,
      })
    })
}

export class TRouter extends Router {
  public opts: Router.IRouterOptions
  public docs: any
  
  constructor(opts: Router.IRouterOptions = {}) {
    super(opts)
    this.opts = opts
    this.docs = {}
  }

  controllers(ctrls: any[] = []): Router {
    const schemas: any[] = flatten(ctrls.map(mapRoute))
    const { docs } = this
    schemas.forEach(schema => {
      const {
        method, middlewares, fn, route,
        group, summary,
        query, body, params, headers,
      } = schema

      // set to router
      this[method](route, ...middlewares, fn)

      /**
       * handle docs
       */
      !docs[group] && (docs[group] = [])

      docs[group].push(filter({
        route,
        method,
        summary,
        query,
        body,
        params,
        headers,
      }))
    })
    return this
  }
}