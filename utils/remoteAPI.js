'using strict'

const https = require('https')
const { URL } = require('url')

function httpsRequest (options) {
  return new Promise((resolve, reject) => {
    const request = https.request(options, function (res) {
      let data = ''

      res.on('data', function (chunk) {
        data += chunk
      })

      res.on('end', function () {
        resolve(data)
      })
    })

    request.on('socket', function (socket) {
      socket.setTimeout(1000)

      socket.on('timeout', function () {
        request.abort()
      })
    })

    request.on('error', function (error) {
      reject(error)
    })

    request.end()
  })
}

module.exports = {
  getJSON: function (url, options) {
    return new Promise((resolve, reject) => {
      httpsRequest(options)
      .then((data) => {
        try {
          resolve(JSON.parse(data))
        } catch (error) {
          reject({
            message: 'Invalid JSON'
          })
        }
      })
      .catch((error) => {
        reject(error)
      })
    })
  }
}
