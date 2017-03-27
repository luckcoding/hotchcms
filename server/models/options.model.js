const mongoose = require('mongoose');

/**
 * 配置模型
 */
const optionsSchema = new mongoose.Schema({

  // 配置名
  name: { type: String, required: true },

  // 值 object
  value: mongoose.Schema.Types.Mixed
  
}, {
  collection: 'options',
  id: false
});

// export default mongoose.model('Options', optionsSchema);
module.exports = mongoose.model('Options', optionsSchema);