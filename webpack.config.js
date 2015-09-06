  var path = require('path');
  var webpack = require('webpack');
  var HtmlWebpackPlugin = require('html-webpack-plugin')
  var merge = require('webpack-merge');
  var ManifestPlugin = require('webpack-manifest-plugin');

  var TARGET = process.env.npm_lifecycle_event;
  // var ROOT_PATH = path.resolve(__dirname);

  var common = {
      entry: './app/main.js',
      output: {
          path: './mopidy_material/public',
          filename: 'bundle.js',
      },
      module: {
          loaders: [{
              test: /\.scss$/,
              loader: 'style!css!autoprefixer?browsers=last 2 versions!sass'
          }, {
              test: /\.html$/,
              loader: "ngtemplate?relativeTo=app/!html"
          }]
      },
      plugins: [new HtmlWebpackPlugin({
          template: './app/index.html',
          inject: 'body'
      }), new ManifestPlugin()]
  };


  if (TARGET === 'start' || !TARGET) {
      module.exports = merge(common, {
          devtool: 'inline-source-map',
          devServer: {
              colors: true,
              historyApiFallback: true,
              hot: true,
              inline: true,
              progress: true,
              host: '0.0.0.0'
          },
          plugins: [
              new webpack.HotModuleReplacementPlugin()
          ]
      });
  } else {
      module.exports = common;
  }
