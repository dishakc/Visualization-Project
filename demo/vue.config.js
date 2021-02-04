const path = require('path')

module.exports = {
    configureWebpack: {
        devtool: 'source-map'
    },   
    publicPath: process.env.NODE_ENV === 'production'
      ? '/dsci-554-projects/project-the-vizards'  //production path
      : '/'  //development path
  }
