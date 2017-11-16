'use strict'

const { prime } = require('../../services')

module.exports = {
  alarms: function (params) {
    /*
    return new Promise(function (resolve, reject) {
      prime.alarms()
      .then((data) => {
        resolve(data)
      })
    })
    */
    return prime.alarms()
  }
}
