const mongoose = require('mongoose')

/**
 * 配置模型
 */
const OptionsSchema = new mongoose.Schema(
  {
    // 配置名
    name: { type: String, required: true, unique: true },

    // 值 object
    value: mongoose.Schema.Types.Mixed,
  },
  {
    collection: 'options',
    id: false,
  }
)

module.exports = mongoose.model('Options', OptionsSchema)
