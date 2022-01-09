const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        "src/index": "./proj/renderer/src/index.ts"
    },
    output: {
        path: path.join(__dirname, "../../dist/renderer"),
        filename: "[name].js",
    },
    module: {
        rules: [
            { // js 파일일 경우 ESx to ES6 
                test: /\.js$/,
                exclude: /node_module/,
                use: {
                    loader: "babel-loader", 
                },
            },
            { // ts 파일
                test: /\.ts$/,
                exclude: /node_module/,
                use: {
                    loader: "ts-loader",
                },
            },
            { // css 파일
                test: /\.css$/,
                use: [  'style-loader', 'css-loader'] // 순서 중요!
            },
        ],
    },
    resolve: {
        modules: [path.join(__dirname, "src"), "node_modules"], // 모듈 위치
        extensions: [".ts", ".js",]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./proj/renderer/src/index.html",
            filename: "src/index.html"
        }),
    ],
    mode: "development"
}