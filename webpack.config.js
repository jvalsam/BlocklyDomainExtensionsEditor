const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    target: 'web',
    mode: 'development',
    entry: {
        index: './src/index.js'
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env'],
                    plugins: [
                        "transform-es2015-destructuring",
                        "transform-object-rest-spread"
                    ]
                }
            }
        }]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new CopyPlugin([
            {
                from: path.resolve(__dirname, 'public'),
                to: path.resolve(__dirname, 'build')
            }
        ]),
        // Copy over media resources from the Blockly package
        new CopyPlugin([
            {
                from: path.resolve(__dirname, './node_modules/blockly/media'),
                to: path.resolve(__dirname, 'build/media')
            }
        ])
    ]
};
