const {
  WebpackBundleSizeAnalyzerPlugin,
} = require('webpack-bundle-size-analyzer')
const webpack = require('webpack')
const withImages = require('next-images')
const withCSS = require('@zeit/next-css')

const { ANALYZE } = process.env

module.exports = withCSS(
  withImages({
    webpack(config) {
      if (ANALYZE) {
        config.plugins.push(new WebpackBundleSizeAnalyzerPlugin('stats.txt'))
      }

      // config.plugins.push(new webpack.DefinePlugin({
      //   'process.env.API_ENV': JSON.stringify(API_ENV)
      // }));

      return config
    },
  })
)
