const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackBar = require('webpackbar');

const WBarOptions = {
  name: "🚚  C Snippet Bundle",
  color: "#f00"
}

const TerserOptions = {
  terserOptions: {
    ecma: 2015,
    compress: {
      drop_console: false,
    },
    output: {
      comments: false,
    },
  },
}

const Loaders = [
  {
    test: /\.tsx?$/,
    loader: 'ts-loader',
    exclude: /node_modules/,
  },
]

module.exports = {
  // mode: 'development', // or 'production'
  devtool: 'inline-source-map',
  entry: './src/index.ts',
  target: 'node', // Set the target to Node.js environment
  output: {
    filename: 'c-snippet-bundle.[contenthash].js', // Include [contenthash] for hashing
    path: path.resolve(__dirname, 'lib'),
    libraryTarget: 'commonjs2', // Set the library target to CommonJS2
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: {
      fs: false, // Disable the fs polyfill
      net: false, // Disable the net polyfill
      tls: false, // Disable the tls polyfill
      path: require.resolve('path-browserify'),
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(TerserOptions),
      new BundleAnalyzerPlugin(),
      new CleanWebpackPlugin(),
      new WebpackBar(WBarOptions)
    ], 
  },
  module: {
    rules: Loaders,
  },
};
