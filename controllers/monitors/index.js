'use strict'

const nagiosController = require('./nagiosController')
const primeController = require('./primeController')

let alarms = {}

module.exports = {
  nagios: nagiosController,
  prime: primeController,

  alarms: function () {
    console.log('Test')
    return new Promise(function (resolve, reject) {
      nagiosController.alarms().then((d) => {
        alarms.nagios = d
      })
      primeController.alarms().then((d) => {
        alarms.prime = d
      })

      resolve(alarms)
    })
  }
}
