'use strict';

var webpack = require('webpack');
var path = require('path');

var config = {
    devServer: {
        historyApiFallback: true,
        contentBase: 'app/',
        publicPath: '/build/'
    },

    resolve: {
        extensions: ['', '.ts', '.js', '.scss', '.html']
    },

    cache: true,
    devtool: 'inline-source-map',

    stats: {
        colors: true,
        reasons: true,
        cached: true
    },

    entry: {
        app: path.resolve('./src/index.ts'),
        preload: ['angular2/bundles/angular2-polyfills.js', 'es6-shim']
    },

    output: {
        path: path.resolve('./app/build/'),
        filename: '[name].bundle.js',
        pathinfo: true
    },

    module: {
        loaders: [{
            test: /\.tsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'ts-loader'
        }, {
            test: /\.scss$/,
            loader: 'style-loader!css?sourceMap!sass?sourceMap'
        }, {
            test: /\.html$/,
            loader: 'html'
        }, {
            test: /\.woff.?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader?limit=10000&minetype=application/font-woff'
        }, {
            test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file-loader'
        }, {
            test: /\.(jpe?g|png|gif|svg)$/i,
            loader: 'file-loader'
        }]
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendors',
        //     filename: 'vendors.bundle.js'
        // })
    ]
};

module.exports = config;
