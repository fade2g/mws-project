/* eslint-env node*/
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const imageminMozjpeg = require("imagemin-mozjpeg");
const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const manifestOptions = require("./build_helper/manifestOptions");

const pathsToClean = ["dist"];

// the clean options to use
const cleanOptions = {
  verbose: true,
  dry: false
};

module.exports = {
  entry: {
    main: "./src/main/index.js",
    single: "./src/single/index.js",
    styles: "./src/css/all_styles.css"
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist")
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/u,
        exclude: /node_modules/u,
        use: [{ loader: "babel-loader" }]
      },
      {
        test: /\.html$/u,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)/iu,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "./img/[name].[ext]",
              limit: 10000
            }
          },
          {
            loader: "image-webpack-loader",
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true // webpack@2.x and newer
            }
          },
          { loader: "img-loader" }
        ]
      },
      {
        test: /\.css$/u,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, "src/serviceworker/index.js"),
      filename: "sw.js",
      excludes: ["**/img/restaurants/*.*"]
      // excludes: ["**/*.*"]
    }),
    new HtmlWebPackPlugin({
      template: "src/main/index.html",
      filename: "./index.html",
      inject: true,
      entry: "main",
      chunks: ["main", "styles"]
    }),
    new HtmlWebPackPlugin({
      template: "src/single/index.html",
      filename: "./restaurant.html",
      inject: true,
      entry: "single",
      chunks: ["single", "styles"]
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: ["sw.js"],
      append: true
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new CopyWebpackPlugin([
      {
        from: "src/assets",
        to: "assets"
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: "src/img/",
        to: "img/restaurants"
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: "src/icons",
        to: "icons"
      }
    ]),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/iu,
      jpegtran: { progressive: true },
      plugins: [
        imageminMozjpeg({
          quality: 25,
          progressive: true
        })
      ]
    }),
    new WebpackPwaManifest(manifestOptions)
  ],
  devtool: "source-map"
};
