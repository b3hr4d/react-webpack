const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const config = {
  entry: "./src/index.tsx",
  output: { path: path.join(__dirname, "/dist"), filename: "bundle.js" },
  devServer: { static: "./dist" },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.(png|jpg|svg)$/, loader: "url-loader" },
    ],
  },
  resolve: { extensions: [".tsx", ".ts", ".js"] },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.ico",
    }),
  ],
}

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config.devtool = "source-map"
  }

  return config
}
