const mongoose = require('mongoose');
const sha1 = require('../services/sha1.service');

/**
 * 管理员
 */
const AdminUserSchema = new mongoose.Schema({

  // 邮箱
  email: {
    type: String, unique: true, trim: true, lowercase: true, required: true,
    match: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  },

  // 密码
  password: { type: String, set: sha1, required: true },

  // 手机
  mobile: { type: Number },

  // 昵称
  nickname: { type: String, trim: true, minlength: 2, maxlength: 20 },
  
  // 头像
  avatar: { type: String, trim: true },

  // 注册信息
  create: {
    // 时间
    date: { type: Date, default: Date.now() },
    // 地点
    address: { type: String, trim: true },
    // IP
    ip: { type: String, trim: true, match: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/ },
    // 平台
    platform: { type: String, trim: true },
    // 其他
    collection: { type: Object }
  },

  // 用户组
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminGroup' },
  
}, {
  collection: 'adminUser',
  id: false
});

AdminUserSchema.statics = {
  _one(_id) {
    return this
      .findById(_id)
      .select('email mobile nickname avatar create group')
      .populate('group', 'name description');
  },

  async _list({ page = 1, size = 20, ...query }) {
    if (query.name) query.name = new RegExp(query.name, 'i');
    const count = await this.count(query);
    const list = await this.find(query).skip((page - 1) * size).limit(size).select(select).lean();
    return { count, page, size, list };
  },

  _count() {
    return this.count({});
  }
};

module.exports = mongoose.model('AdminUser', AdminUserSchema);
