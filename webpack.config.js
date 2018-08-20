const path = require('path'); // include node.js path
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    entry: ['babel-polyfill', './src/js/index.js'],  // ..parent folder : .global folder
    output: {
        path: path.resolve(__dirname, 'dist'),   // __dirname - is current absolute path
        filename: 'js/bundle.js'
    },
    // mode: 'development'
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
        
    
};