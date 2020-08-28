import { ApiError, ajax, uploadFile, downloadFile } from './utils'

const requireApi = require.context('./modules', false, /\.(ts|js)$/i)

function createApi (apiConfig) {
    if (apiConfig instanceof Object && !(apiConfig instanceof Function)) {
        return async function (params, config = {}) {
            // GET 方法使用query参数，其他使用data参数
            if (!apiConfig.url) {
                console.error(`Api未设置url`)
                return
            }
            if (!apiConfig.method) {
                console.error(`Api未设置method: ${apiConfig.url}`)
                apiConfig.method = 'GET'
            }
            const paramsConfig = apiConfig.method.toString().toUpperCase() === 'GET'
                ? { params: params } : { data: params }
            const ajaxConfig = Object.assign({}, paramsConfig, config, apiConfig)
            return ajax(ajaxConfig)
        }
    } else {
        return apiConfig
    }
}

const api = {}
requireApi.keys().forEach(fileName => {
    const apiConfigContext = requireApi(fileName)
    if (apiConfigContext && apiConfigContext.default) {
        const apiConfig = apiConfigContext.default
        Object.keys(apiConfig).forEach(key => {
            api[key] = createApi(apiConfig[key])
        })
    }
})

api.$uploadFile = uploadFile
api.$downloadFile = downloadFile
api.$ajax = ajax

export default api
export { ApiError }
