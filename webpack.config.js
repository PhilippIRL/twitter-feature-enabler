const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    mode: 'production',
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'public',
                },
            ],
        })
    ],
    output: {
        hashFunction: 'sha256' // fix nodejs 17
    }
}
