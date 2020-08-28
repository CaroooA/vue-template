import axios from 'axios'

export const API_SUCCESS_CODE = 1
export const API_MSG_KEY = 'msg'
export const API_CODE_KEY = 'status'
export const API_DATA_KEY = 'data'

const ERROR_CODE = {
    DEFAULT: 0,
    EMPTY_RESPONSE: 1000,
    SERVER_ERROR: 1001,
    UPLOAD_ERROR: 1002,
    NOT_LOGIN: -1
}

const ERROR_INFO = {
    [ERROR_CODE.DEFAULT]: {
        message: '未知错误'
    },
    [ERROR_CODE.EMPTY_RESPONSE]: {
        message: '服务器未响应'
    },
    [ERROR_CODE.SERVER_ERROR]: {
        message: '服务器错误:未知错误'
    },
    [ERROR_CODE.NOT_LOGIN]: {
        message: '登录过期，请重新登录'
    }
}

export class ApiError extends Error {
  static DEFAULT = ERROR_CODE.DEFAULT
  static EMPTY_RESPONSE = ERROR_CODE.EMPTY_RESPONSE
  static SERVER_ERROR = ERROR_CODE.SERVER_ERROR
  static NOT_LOGIN = ERROR_CODE.NOT_LOGIN

  code

  constructor (e, type) {
      if (process.env.NODE_ENV !== 'production') {
          console.error('[API Error]', e)
      }

      // Pass remaining arguments (including vendor specific ones) to parent constructor
      super()

      // Maintains proper stack trace for where our error was thrown (only available on V8)
      if (Error.captureStackTrace) {
          Error.captureStackTrace(this, ApiError)
      }

      this.name = 'ApiError'

      Object.defineProperty(this, 'raw', {
          value: e,
          writable: false,
          enumerable: false
      })
      if (!(e instanceof Object)) {
      // 文字错误信息
          this.message = String(e)
      } else if (e instanceof ApiError) {
      // 不创建新错误
          return e
      } else if (e instanceof Error) {
      // Http状态码错误或前端错误
          this.message = e.toString()
          type = ApiError.DEFAULT
      } else if (e.hasOwnProperty('response')) {
      // console.log('network', e.response)
      // axios上报的网络错误
          if (e.response instanceof Object) {
              this.message = e.response.statusText
              this.code = e.response.status
          } else {
              type = ApiError.EMPTY_RESPONSE
          }
      } else if (e[API_MSG_KEY] || e[API_CODE_KEY]) {
      // 接口内报错
          this.message = e[API_MSG_KEY]
          this.code = e[API_CODE_KEY]
          type = ApiError.SERVER_ERROR
      } else if (!type) {
          type = ApiError.DEFAULT
      } else {
      // 预先传入了type且未被特殊类型覆盖
      }

      if (type) {
          let info = ERROR_INFO[type]
          if (info instanceof Object) {
              if (this.code == null || isNaN(this.code)) {
                  this.code = Number(type)
              }
              if (!this.message) {
                  this.message = info.message
              }
          }
          const defaultInfo = ERROR_INFO[ERROR_CODE.DEFAULT]

          this.code = typeof this.code === 'number'
              ? this.code
              : !isNaN(this.code) ? Number(this.code) : ERROR_CODE.DEFAULT
          this.message = this.message || defaultInfo.message
      }
  }
}

export async function ajax (config, options) {
    const { check = true } = options instanceof Object ? options : {}
    try {
        let res = await axios(config)
        if (!check) return res
        if (
            +res.data[API_CODE_KEY] !== API_SUCCESS_CODE ||
      !(res.data instanceof Object)
        ) {
            throw res.data
        } else {
            return res.data[API_DATA_KEY]
        }
    } catch (e) {
    // console.warn('e', e.toString(), e instanceof Error, e.hasOwnProperty('response'))
    // console.dir(e)
        throw new ApiError(e, ApiError.SERVER_ERROR)
    }
}

export function uploadFile ({ url, method, onUploadProgress, file, fileName, key = 'file', extra = {} }) {
    // console.log('upload', url, file)
    let formdata = new FormData()
    // Fixme 存在file instanceof Blob(false), file instanceof File(true)?
    if (file instanceof Blob || file instanceof File) {
        let fileKey = key || 'file'
        formdata.append(fileKey, file, file instanceof File ? file.name : fileName || '')
    } else {
        throw new ApiError(`参数错误(type:${typeof file})，需要 File`)
    }

    for (let key_ of Object.keys(extra)) {
        formdata.append(key_, extra[key_])
    }
    return ajax({
        method: method || 'POST',
        url: url || '',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: formdata,
        onUploadProgress
    })
}

export async function downloadFile ({ method, ...args }) {
    const res = await ajax({
        ...args,
        method: method || 'get',
        responseType: 'blob'
    }, { check: false })
    // const blob = res.data
    // const contentDisposition = res.headers['content-disposition'] || ''
    // const fileNameRegExp = /filename="(.+)"/i
    // const groups = fileNameRegExp.exec(contentDisposition)
    // let name
    // if (groups instanceof Array && groups[1]) {
    //     name = groups[1]
    // } else {
    //     let g = url.split('/')
    //     name = g[g.length - 1] || ''
    // }
    // if (!name) name = '未命名'
    // console.log(blob, name)
    // return { name, blob }
    return res.data
}
