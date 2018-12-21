const mongoose = require('mongoose')
const sha1 = require('../lib/sha1.lib')

/**
 * 管理员
 */
const AdminUserSchema = new mongoose.Schema(
  {
    // 邮箱
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      match: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    },

    // 密码
    password: { type: String, set: sha1, required: true },

    // 手机
    mobile: {
      type: Number,
      unique: true,
      sparse: true,
      match: /^1[3|4|5|7|8]\d{9}$/,
    },

    // 昵称
    nickname: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 20,
    },

    // 头像
    avatar: { type: String, trim: true },

    // 注册时间
    createDate: { type: Date, default: Date.now },

    // 用户组
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminGroup' },
  },
  {
    collection: 'adminUser',
    id: false,
  }
)

module.exports = mongoose.model('AdminUser', AdminUserSchema)
