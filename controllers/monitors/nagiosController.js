'use strict'

const { URL } = require('url')
const { encryption, remoteAPI } = require('../../utils')

module.exports = {
  alarms: function (params) {
    return new Promise(function (resolve, reject) {
      const url = new URL(process.env.URL_NAGIOS)

      const options = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname + url.search,
        method: 'GET',
        auth: process.env.AD_USER + ':' + encryption.decrypt(process.env.AD_PASS),
        headers: {
          accept: 'application/json'
        }
      }

      remoteAPI.getJSON(url, options)
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error)
      })
    })
  }
}
