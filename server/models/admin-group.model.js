const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');

/**
 * 管理员用户组
 */
const AdminGroupSchema = new mongoose.Schema({
  // 名称
  name: { type: String, required: true, unique: true },

  // 备注
  description: String,

  // 是否最高权限，
  root: { type: Boolean, default: false },

  // 权限列表
  authorities: [Object]
}, {
  collection: 'adminGroup',
  id: false
});

AdminGroupSchema.plugin(unique);

module.exports = mongoose.model('AdminGroup', AdminGroupSchema);