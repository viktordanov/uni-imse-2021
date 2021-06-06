/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isProduction = process.env.MODE === 'production'
const isDevelopment = !isProduction

const plugins = [
  new HtmlWebpackPlugin({
    template: path.join(__dirname, 'index.html')
  })
]

module.exports = {
  entry: './src/index.tsx',
  output: { path: path.join(__dirname, 'build'), filename: 'index.bundle.js' },
  mode: process.env.NODE_ENV || 'development',
  resolve: {
    alias: {
      '@': path.join(__dirname, './src'),
      assets: path.join(__dirname, './assets')
    },
    extensions: ['.tsx', '.ts', '.js']
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['ts-loader']
      },
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        use: ['file-loader']
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'public/'),
    port: 8080,
    host: '0.0.0.0',
    publicPath: '/',
    historyApiFallback: true,
    hot: true
  },
  devtool: isDevelopment && 'eval-source-map',
  plugins
}
