'use strict'

const nagiosController = require('./nagiosController')
const primeController = require('./primeController')

let alarms = {}

module.exports = {
  nagios: nagiosController,
  prime: primeController,

  alarms: function () {
    alarms.nagios = nagiosController.alarms()
    alarms.prime = primeController.alarms()

    return alarms
    /*
    console.log('Test')
    return new Promise(function (resolve, reject) {
      nagiosController.alarms()
      .then((data) => {
        alarms.nagios = data
      })
      primeController.alarms()
      .then((data) => {
        alarms.prime = data
      })

      resolve(alarms)
    })
    */
  }
}
