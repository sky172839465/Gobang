const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        bundle: './src/js/index.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                use: 'babel-loader',
                test: /\.js$/,
                options: {
                    presets: ['es2015']
                },                
                exclude: /node_modules/
            },  
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader']
                }),
                exclude: /node_modules/
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: { 
                            limit: 100,
                            name: '[name].[ext]',
                            outputPath: 'img/'
                        }
                    },
                    'image-webpack-loader'
                ],
                exclude: /node_modules/,
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
        new UglifyJsPlugin({
            test: /\.js($|\?)/i,
            sourceMap: true
        }),
        new ExtractTextPlugin("styles.css"),        
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
}