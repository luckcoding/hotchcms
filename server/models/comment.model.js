const mongoose = require('mongoose')

/**
 * 评论模型
 */
const commentSchema = new mongoose.Schema({

  // 归属
  belong: { type: mongoose.Schema.Types.ObjectId },

  // 继承
  inherit: { type: mongoose.Schema.Types.ObjectId, ref: 'Comments' },

  // 评论内容
  content: { type: String, required: true },

}, {
  collection: 'comment',
  id: false,
})

// export default mongoose.model('Comment', commentSchema);
module.exports = mongoose.model('Comment', commentSchema)
