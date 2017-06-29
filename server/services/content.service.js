const _ = require('lodash');
const contentModel = require('../models/content.model');

const contentSchema = 'title subtitle category tags keywords discription author isTop viewNum comments commentNum likeNum likeUserIds from';

exports.create = options => new Promise(async (resolve, reject) => {
  try {
    const data = _.pick(options, contentSchema.split(' '));
    const content = await new contentModel(data).save();
    resolve(content);
  } catch (e) {
    reject(e);
  };
});