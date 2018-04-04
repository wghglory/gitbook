const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // create index.html injecting index_bundle.js in dist folder
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
  entry: './app/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { modules: false, importLoaders: 1 } },
            {
              loader: 'postcss-loader',
              // Note: if postcss.config.js is in root, don't use config path. Use only file is another folder
              // options: {
              //   config: {
              //     path: './config/postcss.config.js'
              //   }
              // }

              // if not using postcss.config.js
              // options: {
              //   plugins: () => [
              //     require('autoprefixer')(),
              //     require('cssnano')()
              //   ]
              // }

              options: {
                config: {
                  ctx: {
                    cssnano: {},
                    autoprefixer: {},
                  },
                },
              },
            },
          ],
        }),
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { modules: false, importLoaders: 1 } },
            {
              loader: 'postcss-loader',
              // Note: if postcss.config.js is in root, don't use config path. Use only file is another folder
              // options: {
              //   config: {
              //     path: './config/postcss.config.js'
              //   }
              // }

              // if not using postcss.config.js
              // options: {
              //   plugins: () => [
              //     require('autoprefixer')(),
              //     require('cssnano')()
              //   ]
              // }

              options: {
                config: {
                  ctx: {
                    cssnano: {},
                    autoprefixer: {},
                  },
                },
              },
            },
            'sass-loader',
          ],
        }),
      },
      {
        test: /\.csv$/,
        loader: 'dsv-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.html',
    }),
    new ExtractTextPlugin('style.css'),
  ],
};

/*// 1. package.json npm run build will set node env production. 
// 2. NODE_ENV in DefinePlugin: webpack will build this into bundle.js so React realizes it's for production now
if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  );
}
*/

module.exports = config;
