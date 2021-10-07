function GenKey() {
  let randomkeys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let key = ''

  for (let y = 0; y < 24; y++) {
    key += `${randomkeys.charAt(Math.floor(Math.random() * randomkeys.length))}`
  }

  return key
}

module.exports = GenKey
