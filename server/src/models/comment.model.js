const mongoose = require('mongoose')

/**
 * 评论模型
 */
const commentSchema = new mongoose.Schema(
  {
    // 评论所属
    belong: { type: mongoose.Schema.Types.ObjectId },

    // 评论区块 @@ 同一个文章下的评论按照 100 的数量进行拆分，以优化存储
    bucket: { type: Number, default: 1 },

    // 评论数量
    count: { type: Number, default: 0, max: 100 },

    // 评论内容
    comments: [
      {
        userId: String, // 用户标志
        userName: String, // 用户名称
        userAvatar: String, // 用户头像

        posted: { type: Date, default: Date.now }, // 评论时间
        text: String, // 评论内容

        likes: [String], // 喜欢的用户标志集合 [userId,userId,userId...]
        dislikes: [String],
      },
    ],
  },
  {
    collection: 'comment',
    id: false,
  }
)

module.exports = mongoose.model('Comment', commentSchema)
