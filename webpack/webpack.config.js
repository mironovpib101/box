const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/Engine.ts",
  devServer: {
    open: true,
    compress: true,
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    clean: true,
    filename: "app.js",
    path: path.resolve(__dirname, "../dist"),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      fs: false
    }
  },
  plugins: [
    new htmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "../resource", "index.html"),
    }),
  ],
};
