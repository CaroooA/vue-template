const path = require('path')
const fs = require('fs')
const fs_extra = require('fs-extra')

const WORK_PATH = process.cwd()
const ROOT = path.join(WORK_PATH, 'mock', 'ajax')
const tree = fs.readdirSync(ROOT)
const API = {}

function getResponse () {
    return {}
}

function DFS (list, link) {
    if (list instanceof Array && list.length) {
        list.forEach(dir => {
            try {
                const children = fs.readdirSync(path.join(ROOT, ...link, dir)) || []
                DFS(children, [...link, dir])
            } catch (e) {
                DFS([], [...link, dir])
            }
        })
    } else {
        const relatePath = link.join('/')
        const url = '/' + relatePath
        API[url] = getResponse(relatePath)
        console.log(url)
    }
}

DFS(tree, [])

// console.log(p)
