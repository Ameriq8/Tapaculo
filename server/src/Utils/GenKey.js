const crypto = require('crypto')

const genKey = bytes => {
    return crypto.randomBytes(bytes).toString('hex')
}

module.exports = genKey
