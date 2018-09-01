/* eslint-env node*/
const CleanWebpackPlugin = require('clean-webpack-plugin'); 
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const imageminMozjpeg = require("imagemin-mozjpeg");
const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin");
const path = require("path");

const pathsToClean = ['dist'];
   
  // the clean options to use
  let cleanOptions = {
    verbose: true,
    dry: false
  }

module.exports = {
  entry: {
    main: "./src/main/index.js",
    single: "./src/single/index.js"
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.js$/u,
        exclude: /node_modules/u,
        use: { loader: "babel-loader" }
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
    new HtmlWebPackPlugin({
      template: "src/main/index.html",
      filename: "./index.html",
      entry: "main",
      chunks: ["main"]
    }),
    new HtmlWebPackPlugin({
      template: "src/single/index.html",
      filename: "./restaurant.html",
      entry: "single",
      chunks: ["single"]
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new CopyWebpackPlugin([
      {
        from: "src/img",
        to: "img"
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: "src/icons",
        to: "icons"
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: "src/data",
        to: "data"
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
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, "src/service-worker.js"),
      excludes: ["./img/.*"],
      filename: "service-worker.js"
    })
  ],
  devtool: "source-map"
};
