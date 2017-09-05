const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const requireAll = require('require-all');

function viewEngine(app, directory) {
  app.use(views(path.join(__dirname, '../../publish/themes'), {
    extension: 'ejs'
  }));
};

