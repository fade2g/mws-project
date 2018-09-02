/* eslint-env node*/
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const imageminMozjpeg = require("imagemin-mozjpeg");
const ServiceWorkerWebpackPlugin = require("serviceworker-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const pathsToClean = ["dist"];

// the clean options to use
const cleanOptions = {
  verbose: true,
  dry: false
};

const manifestOptions = {
  name: "Restaurant Review",
  short_name: "RR***",
  description: "Udacity Restaurant Review Stage 2 PWA",
  start_url: "/",
  background_color: "#ffffff",
  theme_color: "#ffffff",
  crossorigin: "use-credentials", // can be null, use-credentials or anonymous
  icons: [
    {
      src: path.resolve("src/icons/logo.png"),
      sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
    } /* ,
    {
      src: path.resolve("src/assets/large-icon.png"),
      size: "1024x1024" // you can also use the specifications pattern
    } */
  ]
};

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
        from: "src/assets",
        to: "assets"
      }
    ]),
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
      filename: "service-worker.js",
      excludes: ['**/img/*.*']
    }),
    new WebpackPwaManifest(manifestOptions)
  ],
  devtool: "source-map"
};
