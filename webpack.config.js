var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',

  entry: [
    'webpack-hot-middleware/client',
    './example/app'
  ],

  output: {
    path: __dirname + '/public/',
    filename: 'bundle.js',
    publicPath: 'http://localhost:3001/public/',
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: 'style!css?sourceMap!postcss!resolve-url!sass?sourceMap!./remote-loader'
      },
      {
        test: /\.jsx*$/,
        exclude: [/node_modules/, /.+\.config.js/],
        loader: 'babel',
        query: {
          presets: ['react-hmre'],
        },
      },
      {
        test: /\.(png|jpg|gif|woff|woff2)$/,
        loader: 'url-loader?limit=8192&name=[name].[hash].[ext]'
      },
    ],
  },

  plugins: [
    new webpack.ProvidePlugin({
       Promise: 'imports?this=>global!exports?global.Promise!es6-promise',
     }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        CLIENT: JSON.stringify(true)
      }
    })
  ],
};
