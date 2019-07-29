// TO DO: 
// Tratar otimização de imagens
// Validar se /dist esta com tamanhos aceitaveis

const path = require('path')
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssets = require('optimize-css-assets-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')
const webpack = require('webpack')
const devMode = process.env.NODE_ENV === 'development'

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new DashboardPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new HtmlWebpackPlugin({
            hash: true,
            minify: {
                html5: false,
                collapseWhitespace: false,
                removeComments: true
            },
            filename: 'index.html',
            template: __dirname + '/src/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'style.css'
        }),
        new webpack.ProvidePlugin({
            '$': 'jquery/dist/jquery.js',
            'jQuery': 'jquery/dist/jquery.js'
        })
    ],
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [{
                    loader: 'file-loader',
                    options: {
                        name: 'assets/images/[name].[ext]'
                    }
                }]
            }
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        open: true
    }
}

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins.push(
        new OptimizeCSSAssets({
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true
                }
            },
            canPrint: true
        })
    )
}