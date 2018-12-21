const mongoose = require('mongoose')
const { parse } = require('../lib/authority.lib')

/**
 * 管理员用户组
 */
const AdminGroupSchema = new mongoose.Schema(
  {
    // 名称
    name: { type: String, required: true, unique: true },

    // 备注
    description: String,

    // 管理等级
    gradation: {
      type: Number,
      mix: 0,
      max: 100,
      default: 0,
    },

    // 权限列表
    authorities: { type: Array, default: [] },
  },
  {
    collection: 'adminGroup',
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    id: false,
  }
)

AdminGroupSchema.virtual('authority').get(() => parse(this.authorities))

module.exports = mongoose.model('AdminGroup', AdminGroupSchema)
