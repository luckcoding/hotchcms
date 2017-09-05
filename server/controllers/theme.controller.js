const fs = require('fs');
const path = require('path');
const Theme = require('../models/theme.model');
const ThemeTemplate = require('../models/theme-template.model');

exports.list = async (ctx) => {
  const directory = path.join(__dirname, '../../publish/themes');
  fs.readdirSync(directory)
    .forEach(function (file) {
      const fullpath = path.join(directory, file);
      const stat = fs.statSync(fullpath);
      if (stat.isDirectory()) {
        console.log(file)
      }
    })
};