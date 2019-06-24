module.exports = function (paths) {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'strip-loader',
          options: {
            strip: ['console.log', 'alert']
          }
        }      ]
    }
  }
}