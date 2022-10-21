//import path module
const path = require('path');
//import mini css extract plugin
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//export module object
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '',
        filename: 'bundle.js'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader'
                    },
                    {   
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass')
                        }
                    }
                ]
            },
            {
                test: /\.(obj|mtl|fbx)$/i,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'bundle.css'
        })
    ]
};
