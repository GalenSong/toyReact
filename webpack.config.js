const path = require('path');

module.exports = {
    entry: {
        main: './main.js'
    },
    mode: 'development',
    optimization: {
        minimize: false
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [[
                            "@babel/plugin-transform-react-jsx",
                            {pragma: "ToyReact.createElement"}
                        ]]
                    }
                }
            }
        ]
    }
}