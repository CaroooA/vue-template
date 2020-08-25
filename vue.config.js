const SimpleMockPlugin = require('./mock/SimpleMockPlugin')

// mock服务器端口
const DEV_PORT = 3010
const TARGET = {
    // 本地测试环境（mock接口）
    DEV: `http://localhost:${DEV_PORT}`,
    // 局域网联调
    DEBUG: '',
    // 线上测试环境
    PRODUCTION: '',
}

const target = TARGET.DEV
// const target = TARGET.DEBUG
// const target = TARGET.PRODUCTION

let plugins = []
if (process.env.NODE_ENV === 'development' && target === TARGET.DEV) {
    plugins.push(new SimpleMockPlugin(DEV_PORT))
}

const proxy = {
    [TARGET.DEV]: {
        '^/api': {
            target: target,
            changeOrigin: true
        }
    },
    [TARGET.DEBUG]: {
        '^/api': {
            target: target,
            changeOrigin: true
        }
    },
    [TARGET.PRODUCTION]: {
        '^/api': {
            target: target,
            changeOrigin: true
        }
    }
}

module.exports = {
    devServer: {
        overlay: {
            warnings: true,
            errors: true
        },
        proxy: proxy[target] || {}
    },
    productionSourceMap: false,
    configureWebpack: {
        plugins
    },
    chainWebpack: config => {
        config.plugin('prefetch').tap(options => {
            options[0].fileBlacklist = options[0].fileBlacklist || []
            options[0].fileBlacklist.push(
                // 不提前加载echarts
                /(js|css)\/echarts(.)+?\.(js|css)$/,
            )
            return options
        })
    },
}
