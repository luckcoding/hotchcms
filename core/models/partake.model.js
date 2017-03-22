const mongoose = require('mongoose');

/**
 * 评论模型
 */
const partakeSchema = new mongoose.Schema({

  // 归属
  belong: { type: mongoose.Schema.Types.ObjectId },
  
  // 参与者
  actor: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    name: { type: String }
  }
  
}, {
  collection: 'partake',
  id: false
});

// export default mongoose.model('Partake', partakeSchema);
module.exports = mongoose.model('Partake', partakeSchema);