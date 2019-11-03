import shortid from 'shortid'
import { plugin } from '@typegoose/typegoose'

interface Json {
  [key: string]: any
}

export function plugins (schema) {
  // attrs
  schema.add({
    _c: { type: Date, default: Date.now },
    _u: { type: Date, default: Date.now },
    _d: { type: Number, enum: [0, 1], default: 0 },
  })

  // update hook
  schema.pre('save', function (next) {
    this._u = new Date();
    next();
    // this.update({}, { $set: { _update: new Date() } })
  })

  // unique ID
  schema.add({
    _id: { type: String, default: shortid.generate },
  })

  /**
   * paginate
   */
  schema.statics.paginate = function (query: Json, options: Json = {}): Promise<any> {
    const page = Number(options.page) || 1
    const pageSize = Number(options.pageSize) || 10

    const sort = options.sort
    const lean = options.lean || false
    const select = options.select
    const populates = Array.isArray(options.populate)
      ? options.populate
      : []

    // query docs
    let docsQuery = this.find(query)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select(select)
      .lean(lean)
    populates.forEach(eachPopulate => {
      docsQuery.populate(eachPopulate)
    })

    return Promise.all([
      this.countDocuments(query).exec(), // count by query
      docsQuery.exec(),
    ]).then(([ total, list ]) => {
      return Promise.resolve({ list, total, pageSize, page })
    })
  }
}

@plugin(plugins)
export class Plugins {
  static paginate: (query: Json, options: Json) => Promise<any>;
}