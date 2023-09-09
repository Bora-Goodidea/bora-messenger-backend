'use strict'
/**
 babel.config.js with useful plugins.
 */
module.exports = function (api) {
    api.cache(true)

    const presets = ['@babel/preset-env', '@babel/preset-typescript']
    const plugins = [
        [
            '@babel/plugin-proposal-decorators',
            {
                version: 'legacy',
            },
        ],
        [
            '@babel/plugin-transform-runtime',
        ],
        [
            '@babel/plugin-proposal-class-properties',
        ],
        [
            '@babel/plugin-proposal-private-property-in-object',
        ],
        [
            '@babel/plugin-proposal-private-methods',
        ],
        [
            'module-resolver',
            {
                root: ['./src'],
                alias: {
                    '@Commons/*': './src/Common/*',
                    '@Servers/*': './src/Server/*',
                    '@Routes/*': './src/Route/*',
                    '@Controllers/*': './src/Controller/*',
                    '@Config': './src/Common/Config',
                    '@Logger': './src/Common/Logger',
                    '@Messages': './src/Common/Messages',
                    '@Const': './src/Common/Const',
                    '@Codes': './src/Common/Codes',
                    '@Database/*': './src/Database/*',
                    '@Entity/*': './src/Database/Entities/*',
                    '@Service/*': './src/Database/Service/*'
                },
            },
        ],
        'source-map-support',
    ]

    return {
        presets,
        plugins,
    }
}
