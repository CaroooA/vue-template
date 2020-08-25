const path = require('path')
const fs = require('fs')
const fs_extra = require('fs-extra')

const cwd = process.cwd()
const mockDir_ajax = path.join(cwd, 'mock', 'ajax')

function getDatetimeStr (date) {
    if (date instanceof Date && date.valueOf()) {
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const hour = date.getHours().toString().padStart(2, '0')
        const minute = date.getMinutes().toString().padStart(2, '0')
        const second = date.getSeconds().toString().padStart(2, '0')
        const millisecond = date.getMilliseconds().toString().padStart(3, '0')
        return `${year}-${month}-${day} ${hour}:${minute}:${second}:${millisecond}`
    }
}

fs_extra.ensureDirSync(mockDir_ajax)

module.exports = async function (req, res, next) {
    let filePath = req.path || ''
    let mockPath
    let context

    console.log(req.method, getDatetimeStr(new Date()), filePath)

    if (ifStaticFile(filePath)) {
        return res.json({ message: 'not support static file' })
    }

    filePath = filePath.replace(/(\/?)$/, '')
    mockPath = path.join(mockDir_ajax, filePath + '.tpl.js')
    fs_extra.ensureFileSync(mockPath)
    context = fs.readFileSync(mockPath, 'utf8')

    if (context === '') {
        fs.writeFileSync(mockPath, 'module.exports = {};', 'utf8')
    }

    delete require.cache[require.resolve(mockPath)]
    context = require(mockPath)

    await sleep(100)

    return res.json(context)
}

function sleep (ms) {
    if (!ms) return Promise.resolve()
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}

function ifStaticFile (type) {
    const imgRex = /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/
    const fontRex = /\.(woff2?|eot|ttf|otf)(\?.*)?$/
    const scriptRex = /\.(js|css)(\?.*)?$/

    return imgRex.test(type) || fontRex.test(type) || scriptRex.test(type)
}
