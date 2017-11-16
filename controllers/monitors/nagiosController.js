'use strict'

const { nagios } = require('../../services')

module.exports = {
  alarms: function (params) {
    /*
    return new Promise(function (resolve, reject) {
      nagios.alarms()
      .then((data) => {
        resolve(data)
      })
    })
    */
    return nagios.alarms()
  }
}
