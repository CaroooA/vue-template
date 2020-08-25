const express = require('express')
const returnData = require('./mock-handle.js')

function isIp (text) {
    return text.toString().split(':').every(sub => sub && !isNaN(sub))
}

module.exports = function (port) {
    const mockPort = port || 3000
    const app = express()
    app.use((req, res, next) => {
        if (/^\/*$/.test(req.path)) {
            return res.json({ message: 'not support' })
        } else {
            next()
        }
    })
    app.use(returnData)

    const server = app.listen(mockPort, function () {
        const host = server.address().address
        const port = server.address().port
        console.log()
        console.log(`Mock server listening at http://${isIp(host) ? host : 'localhost'}:${port}`)
        console.log()
    })
}
