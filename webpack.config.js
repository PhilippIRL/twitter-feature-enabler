const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    mode: 'development',
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'public',
                },
            ],
        })
    ],
    entry: {
        contentScript: './src/index.js',
        inject: './src/inject.js',
    },
    output: {
        hashFunction: 'sha256' // fix nodejs 17
    },
    devtool: 'source-map',
}
