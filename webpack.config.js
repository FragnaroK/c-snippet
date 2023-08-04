const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackBar = require('webpackbar');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const SizePlugin = require('size-plugin');

const smp = new SpeedMeasurePlugin();

const aliases = {
  '@root': path.resolve(__dirname, 'src'),
  '@utils': path.resolve(__dirname, 'src/utils'),
  '@interfaces': path.resolve(__dirname, 'src/types/types.ts'),
};

const terserOptions = {
  ecma: 2015,
  compress: {
    drop_console: false,
  },
  output: {
    comments: false,
  },
};

const analyzerOptions = {
  analyzerMode: 'static',
};

const loaders = [
  {
    test: /\.tsx?$/,
    loader: 'ts-loader',
    exclude: /node_modules/,
  },
];

const plugins = [
  new SizePlugin(),
  new BundleAnalyzerPlugin(analyzerOptions),
  new CleanWebpackPlugin(),
  new WebpackBar({
    name: '🚚  C Snippet Bundle',
    color: '#0f0',
  }),
];

const webpackConfig = smp.wrap({
  // mode: 'development', // or 'production'
  devtool: 'inline-source-map',
  entry: './src/index.ts',
  target: 'node', // Set the target to Node.js environment
  output: {
    filename: 'c-snippet-bundle.[contenthash].js', // Include [contenthash] for hashing
    path: path.resolve(__dirname, 'lib'),
    libraryTarget: 'commonjs2', // Set the library target to CommonJS2
  },
  plugins,
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: {
      fs: false, // Disable the fs polyfill
      net: false, // Disable the net polyfill
      tls: false, // Disable the tls polyfill
      path: require.resolve('path-browserify'),
    },
    alias: aliases,
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ terserOptions })],
  },
  module: {
    rules: loaders,
  },
});

module.exports = webpackConfig;
