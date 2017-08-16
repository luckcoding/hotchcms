const mongoose = require('mongoose');
const sha1 = require('../services/sha1.service');

/**
 * trim: 去除字符串2边空格
 * unique: 唯一
 * enum: 枚举验证
 */

/**
 * 用户模型
 */
const usersSchema = new mongoose.Schema({

  // 手机
  mobile: { type: Number, unique: true },

  // 邮箱
  email: {
    type: String, unique: true, trim: true, lowercase: true, required: true,
    match: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  },

  // 密码
  password: { type: String, set: sha1, required: true },

  // 帐号名
  nickname: { type: String, unique: true, trim: true, minlength: 2, maxlength: 20 },
  
  // 头像
  avatar: { type: String, trim: true },

  // 资源库数
  repositories: { type: Number, default: 0, },

  // 追随者数
  followers: { type: Number, default: 0, },

  // 关注数
  following: { type: Number, default: 0, },

  // 金币数
  coin: { type: Number, default: 0, },

  // 积分
  integral: { type: Number, default: 0, },

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

  // 权限
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Roles' },

}, {
  collection: 'users',
  id: false
});

module.exports = mongoose.model('Users', usersSchema);