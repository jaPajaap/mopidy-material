// var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: ['webpack/hot/dev-server', './app/main.js'],
    output: {
        path: './build',
        filename: 'bundle.js',
    },
    plugins: [new HtmlWebpackPlugin({
        template: './app/index.html',
        inject: 'body'
    }), new HtmlWebpackPlugin({
        filename: 'callback.html',
        title: 'Mopidy Material Callback',
        template: './app/callback.html'
    })],
    module: {
        loaders: [{
            test: /\.scss$/,
            loader: 'style!css!sass'
        }, {
            test: /\.html$/,
            loader: "ngtemplate?relativeTo=app/!html"
        }]
    }
};
