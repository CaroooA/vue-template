export function isRegExp (v) {
    return Object.prototype.toString.call(v) === '[object RegExp]'
}

const REGEXP_PATTERN = /^\/(.+)\/([igm])?$/i

export function isRegExpStr (text) {
    return REGEXP_PATTERN.test(text)
}

export function toRegExp (text) {
    let group = REGEXP_PATTERN.exec(text)
    if (group) {
        try {
            return new RegExp(group[1], group[2])
        } catch (e) {
            // console.warn(e)
        }
    }
}

export function isValidDate (d) {
    return d instanceof Date && !isNaN(d.valueOf())
}

export function isTimestamp (t) {
    return (typeof t === 'number' && !isNaN(t)) || (typeof t === 'string' && t && !isNaN(t))
}

export function toTimestamp (v) {
    if (isTimestamp(v)) {
        return +v
    } else if (isValidDate(v)) {
        return v.valueOf()
    } else {
        return NaN
    }
}

export function toValidDate (v) {
    if (isTimestamp(v)) {
        v = new Date(+v)
    } else if (v instanceof Date) {
    // do nothing
    }
    return isValidDate(v) ? v : null
}

const TYPE = {
    DATE: 'date',
    DATETIME: 'datetime'
}

export function formatTime (d, type = TYPE.DATETIME) {
    if (isTimestamp(d)) {
        d = new Date(+d)
    } else if (isValidDate(d)) {
    // do nothing
    } else {
        d = null
    }
    if (d) {
        const year = d.getFullYear().toString().padStart(4, '0')
        const month = (d.getMonth() + 1).toString().padStart(2, '0')
        const date = d.getDate().toString().padStart(2, '0')
        const hour = d.getHours().toString().padStart(2, '0')
        const minute = d.getMinutes().toString().padStart(2, '0')
        const second = d.getSeconds().toString().padStart(2, '0')
        switch (type) {
        case TYPE.DATETIME:
            return `${year}-${month}-${date} ${hour}:${minute}:${second}`
        case TYPE.DATE:
            return `${year}-${month}-${date}`
        default:
            return ''
        }
    }
    return ''
}

export function DFS (tree, fn, option) {
    if (!(tree instanceof Array)) return
    if (!(fn instanceof Function)) return
    let { childKey = 'children' } = option || {}
    let stack = [...tree]
    stack.reverse()
    while (stack.length) {
        const node = stack.pop()
        let res = fn(node)
        // 如果函数返回truthy则停止遍历
        if (res) {
            return node
        }
        if (node[childKey] instanceof Array && node[childKey].length) {
            let list = [...node.children]
            list.reverse()
            stack.push(...list)
        }
    }
}

export function saveBlob (blob, name) {
    if (blob instanceof Blob) {
        const objectUrl = URL.createObjectURL(blob)
        if ('download' in document.createElement('a')) {
            const a = document.createElement('a')
            a.href = objectUrl
            a.download = name || ''
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        } else {
            navigator.msSaveBlob(blob)
        }
        URL.revokeObjectURL(objectUrl)
    }
}

// 最好传入attach的元素，否则select事件可能被拦截
export function copyToClipboard (text, attach) {
    if (typeof text !== 'string') {
        throw Error('复制失败，需要字符串')
    }
    // console.log('copy', text)
    const input = document.createElement('textarea')
    // Prevent zooming on iOS
    input.style.fontSize = '12pt'
    // Reset box model
    input.style.border = '0'
    input.style.padding = '0'
    input.style.margin = '0'
    // Move element out of screen horizontally
    input.style.position = 'absolute'
    input.style.left = '-9999px'
    // Move element to the same position vertically
    let yPosition = window.pageYOffset || document.documentElement.scrollTop
    input.style.top = `${yPosition}px`

    input.setAttribute('readonly', '')
    input.value = text
    const attachNode = attach || document.body
    attachNode.appendChild(input)
    input.select()
    input.blur()
    document.execCommand('Copy')
    // attachNode.removeChild(input)
}
