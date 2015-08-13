var path = require('path');
var webpack = require('webpack');
var nodeModules = path.resolve(__dirname, './node_modules');

module.exports = {
    entry: ['webpack/hot/dev-server', path.resolve(__dirname, './app/main.js')],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    module: {
        loaders: [{
            test: /\.scss$/,
            loader: 'style!css!sass'
        }, {
            test: /\.html$/,
            loader: "ngtemplate?relativeTo=" + (path.resolve(__dirname, './app')) + "/!html"
        }]
    }
};
