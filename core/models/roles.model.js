const mongoose = require('mongoose');

/**
 * 角色模型
 */
const rolesSchema = new mongoose.Schema({

  // 角色名称
  name: { type: String, required: true },

  // 角色备注
  description: String,

  // 权限列表
  authorities: [Number]
  
}, {
  collection: 'roles',
  id: false
});

// export default mongoose.model('Roles', rolesSchema);
module.exports = mongoose.model('Roles', rolesSchema);