const mongoose = require('mongoose')
const Validator = require('../lib/mongoose-validator-schema')

/**
 * 管理员用户组
 */
const AdminGroupSchema = new mongoose.Schema({
  // 名称
  name: { type: String, required: true, unique: true },

  // 备注
  description: String,

  // 管理等级
  gradation: { type: Number, mix: 0, max: 100, default: 0 },

  // 权限列表
  authorities: { type: Array, default: [] },
}, {
  collection: 'adminGroup',
  id: false,
})

AdminGroupSchema.plugin(Validator)

module.exports = mongoose.model('AdminGroup', AdminGroupSchema)
