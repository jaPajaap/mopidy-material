var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var merge = require('webpack-merge');
var TARGET = process.env.npm_lifecycle_event;
// var ROOT_PATH = path.resolve(__dirname);

var common = {
    entry: './app/main.js',
    output: {
        path: './build',
        filename: 'bundle.js',
    },
    module: {
        loaders: [{
            test: /\.scss$/,
            loader: 'style!css!sass'
        }, {
            test: /\.html$/,
            loader: "ngtemplate?relativeTo=app/!html"
        }]
    },
    plugins: [new HtmlWebpackPlugin({
        template: './app/index.html',
        inject: 'body'
    }), new HtmlWebpackPlugin({
        template: './app/callback.html',
        filename: 'callback.html'
    })]
};


if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
      colors: true,
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  });
} else {
  module.exports = common;
}
