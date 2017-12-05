// Math.trunc polyfill
export const mathTrunc = (() => {
    if (Math.trunc) {
        return Math.trunc
    }
    return function(x) {
        return x === 0 ? x : x < 0 ? Math.ceil(x) : Math.floor(x)
    }
})()

// Object.assign polyfill
export const objectAssign = (() => {
    if (Object.assign) {
        return Object.assign
    }
    return function(target) {
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object')
        }
        const output = Object(target)
        for (let index = 1; index < arguments.length; index++) {
            const source = arguments[index]
            if (source !== undefined && source !== null) {
                for (const nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey]
                    }
                }
            }
        }
        return output
    }
})()
